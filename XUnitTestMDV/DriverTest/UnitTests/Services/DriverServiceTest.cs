using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using DDDNetCore.Drivers.Domain;
using DDDNetCore.Drivers.Dto;
using DDDNetCore.Drivers.Mappers;
using DDDNetCore.Drivers.Repository;
using DDDNetCore.Drivers.Services;
using DDDNetCore.Vehicles.Domain;
using DDDNetCore.Vehicles.Dto;
using DDDNetCore.Vehicles.Mappers;
using DDDNetCore.Vehicles.Repository;
using DDDNetCore.Vehicles.Services;
using DDDSample1.Domain.Shared;
using Moq;
using Moq.Protected;
using Xunit;

namespace XUnitTestMDV.DriverTest.UnitTests.Services
{
    public class DriverServiceTest
    {
        [Fact]
        public async void ShouldRegisterDriver_NormalSituation1()
        {
            string MechanographicNumber = "123456789";
            string Name = "jajaja1";
            string BirthDate = "2000/06/28";
            string CitizenCardNumber = "12345678";
            string EntryDate = "2020/11/20";
            string DepartureDate = "2020/11/21";
            string FiscalNumber = "123456789";
            string Type = "PandaKungFu";
            string License = "P-564681651 A";
            string LicenseDate = "2020/11/20";

            Driver domainObj = new Driver(MechanographicNumber, Name, BirthDate, CitizenCardNumber, EntryDate,
                DepartureDate, FiscalNumber, Type, License, LicenseDate);
            DriverDto inputObj = new DriverDto(MechanographicNumber, Name, BirthDate, CitizenCardNumber, EntryDate, DepartureDate, FiscalNumber, Type,License,LicenseDate);


            //Mock dependencies
            var unitOfWork = new Mock<IUnitOfWork>();
            unitOfWork.Setup(o => o.CommitAsync())
                .Returns(Task.FromResult(200));

            // Mock the handler
            var mockHttpMessageHandler = new Mock<HttpMessageHandler>();

            // Setup Protected method on HttpMessageHandler mock.
            mockHttpMessageHandler.Protected()
                .Setup<Task<HttpResponseMessage>>(
                    "SendAsync",
                    ItExpr.IsAny<HttpRequestMessage>(),
                    ItExpr.IsAny<CancellationToken>()
                ).ReturnsAsync(new HttpResponseMessage()
                {
                    StatusCode = HttpStatusCode.OK
                });


            // use real http client with mocked handler here
            var httpClient = new HttpClient(mockHttpMessageHandler.Object)
            {
                BaseAddress = new Uri("http://test.com/"),
            };


            var httpClientFactoryMock = new Mock<IHttpClientFactory>();

            // setup the method call
            httpClientFactoryMock.Setup(x => x.CreateClient(It.IsAny<String>()))
                .Returns(httpClient);

            var driverRepo = new Mock<IDriverRepository>();
            driverRepo.Setup(o => o.AddAsync(domainObj))
                .Returns(Task.FromResult(domainObj));

            var mapper = new Mock<IDriverMapper>();
            mapper.Setup(o => o.MapFromDriverDtoToDomain(inputObj))
               .Returns(domainObj);
            mapper.Setup(o => o.MapFromDomain2Dto(domainObj))
               .Returns(inputObj);




            //Run the service
            var serv = new DriverService(unitOfWork.Object, driverRepo.Object, mapper.Object, httpClientFactoryMock.Object);

            var result = await serv.AddAsync("Bearer 215418152", inputObj);


            Assert.Equal(inputObj.MechanographicNumber, result.MechanographicNumber);
            Assert.Equal(inputObj.Type, result.Type);
            Assert.Equal(inputObj.CitizenCardNumber, result.CitizenCardNumber);
            Assert.Equal(inputObj.Name, result.Name);
            Assert.Equal(inputObj.FiscalNumber, result.FiscalNumber);
            Assert.Equal(inputObj.BirthDate, result.BirthDate);
            Assert.Equal(inputObj.DepartureDate, result.DepartureDate);
            Assert.Equal(inputObj.EntryDate, result.EntryDate);
            Assert.Equal(inputObj.License, result.License);
            Assert.Equal(inputObj.LicenseDate, result.LicenseDate);
        }

        [Fact]
        public async void ShouldRegisterVehicle_ExceptionOcurred_VehicleTypeDoesNotExist_1()
        {
            string MechanographicNumber = "123456789";
            string Name = "jajaja1";
            string BirthDate = "2000/06/28";
            string CitizenCardNumber = "12345678";
            string EntryDate = "2020/11/20";
            string DepartureDate = "2020/11/21";
            string FiscalNumber = "123456789";
            string Type = "PandaKungFu";
            string License = "P-564681651 A";
            string LicenseDate = "2020/11/20";

            Driver domainObj = new Driver(MechanographicNumber, Name, BirthDate, CitizenCardNumber, EntryDate,
                DepartureDate, FiscalNumber, Type, License, LicenseDate);
            DriverDto inputObj = new DriverDto(MechanographicNumber, Name, BirthDate, CitizenCardNumber, EntryDate, DepartureDate, FiscalNumber, Type, License, LicenseDate);



            //Mock dependencies
            var unitOfWork = new Mock<IUnitOfWork>();
            unitOfWork.Setup(o => o.CommitAsync())
                .Returns(Task.FromResult(200));


            var mockHttpMessageHandler = new Mock<HttpMessageHandler>();

            // Setup Protected method on HttpMessageHandler mock.
            mockHttpMessageHandler.Protected()
                .Setup<Task<HttpResponseMessage>>(
                    "SendAsync",
                    ItExpr.IsAny<HttpRequestMessage>(),
                    ItExpr.IsAny<CancellationToken>()
                ).ReturnsAsync(new HttpResponseMessage()
                {
                    StatusCode = HttpStatusCode.BadRequest
                });


            // use real http client with mocked handler here
            var httpClient = new HttpClient(mockHttpMessageHandler.Object)
            {
                BaseAddress = new Uri("http://test.com/"),
            };


            var httpClientFactoryMock = new Mock<IHttpClientFactory>();

            // setup the method call
            httpClientFactoryMock.Setup(x => x.CreateClient(It.IsAny<String>()))
                .Returns(httpClient);


            var mapper = new Mock<IDriverMapper>();
            mapper.Setup(o => o.MapFromDriverDtoToDomain(inputObj))
                .Returns(domainObj);
            mapper.Setup(o => o.MapFromDomain2Dto(domainObj))
                .Returns(inputObj);

            var driverRepo = new Mock<IDriverRepository>();
            driverRepo.Setup(o => o.AddAsync(domainObj))
                .Returns(Task.FromResult(domainObj));

            //Run the service
            var serv = new DriverService(unitOfWork.Object, driverRepo.Object, mapper.Object, httpClientFactoryMock.Object);

            var expresult = new Exception("That type of driver does not exist !");

            try
            {
                var result = await serv.AddAsync("Bearer 215418152", inputObj);
                Assert.True(false);
            }
            catch (Exception e)
            {
                Assert.Equal(e.Message, expresult.Message);
            }

        }


        [Fact]
        public async void ShouldRegisterVehicle_ExceptionOcurred_LocalValidationFail_1()
        {
            string MechanographicNumber = "123456789";
            string Name = "jajaja1";
            string BirthDate = "2000/06/28";
            string CitizenCardNumber = "12345678";
            string EntryDate = "2020/11/20";
            string DepartureDate = "2020/11/21";
            string FiscalNumber = "123456789";
            string Type = "PandaKungFu";
            string License = "P-564681651 A";
            string LicenseDate = "2020/11/20";

            Driver domainObj = new Driver(MechanographicNumber, Name, BirthDate, CitizenCardNumber, EntryDate,
                DepartureDate, FiscalNumber, Type, License, LicenseDate);
            DriverDto inputObj = new DriverDto(MechanographicNumber, Name, BirthDate, CitizenCardNumber, EntryDate, DepartureDate, FiscalNumber, Type, License, LicenseDate);



            Exception error = new Exception("Local validation failed.");

            //Mock dependencies
            var unitOfWork = new Mock<IUnitOfWork>();
            unitOfWork.Setup(o => o.CommitAsync())
                .Returns(Task.FromResult(200));

            var mockHttpMessageHandler = new Mock<HttpMessageHandler>();

            // Setup Protected method on HttpMessageHandler mock.
            mockHttpMessageHandler.Protected()
                .Setup<Task<HttpResponseMessage>>(
                    "SendAsync",
                    ItExpr.IsAny<HttpRequestMessage>(),
                    ItExpr.IsAny<CancellationToken>()
                ).ReturnsAsync(new HttpResponseMessage()
                {
                    StatusCode = HttpStatusCode.OK
                });


            // use real http client with mocked handler here
            var httpClient = new HttpClient(mockHttpMessageHandler.Object)
            {
                BaseAddress = new Uri("http://test.com/"),
            };


            var httpClientFactoryMock = new Mock<IHttpClientFactory>();

            // setup the method call
            httpClientFactoryMock.Setup(x => x.CreateClient(It.IsAny<String>()))
                .Returns(httpClient);

            var mapper = new Mock<IDriverMapper>();
            mapper.Setup(o => o.MapFromDriverDtoToDomain(inputObj))
                .Throws(error);
            mapper.Setup(o => o.MapFromDomain2Dto(domainObj))
                .Returns(inputObj);

            var driverRepo = new Mock<IDriverRepository>();
            driverRepo.Setup(o => o.AddAsync(domainObj))
                .Returns(Task.FromResult(domainObj));


            //Run the service
            var serv = new DriverService(unitOfWork.Object, driverRepo.Object, mapper.Object, httpClientFactoryMock.Object);

            var expresult = error;

            try
            {
                var result = await serv.AddAsync("Bearer 215418152", inputObj);
                Assert.True(false);
            }
            catch (Exception e)
            {
                Assert.Same(expresult, e);
            }

        }
    }
}
