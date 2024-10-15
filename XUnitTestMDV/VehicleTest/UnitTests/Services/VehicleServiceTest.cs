using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Formatting;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using DDDNetCore.VehicleDuties.Services;
using DDDNetCore.Vehicles.Domain;
using DDDNetCore.Vehicles.Dto;
using DDDNetCore.Vehicles.Mappers;
using DDDNetCore.Vehicles.Repository;
using DDDNetCore.Vehicles.Services;
using DDDSample1.Domain.Shared;
using Microsoft.VisualStudio.TestPlatform.CommunicationUtilities;
using Moq;
using Moq.Protected;
using Xunit;

namespace XUnitTestMDV.VehicleTest.UnitTests.Services
{
    public class VehicleServiceTest
    {
        [Fact]
        public async void ShouldRegisterVehicle_NormalSituation1()
        {
            //Request simulation variables
            string vin = "12345678901234567";
            string license = "AA-01-AA";
            string type = "VehicleTypeTT";
            string date = "2015/12/25";

            //Obtain the domain objects preentively
            VehicleDto inputObj = new VehicleDto(license, vin, type, date);
            Vehicle domainObj = new Vehicle(license, vin, type, date);

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

            var vehicleRepo = new Mock<IVehicleRepository>();
            vehicleRepo.Setup(o => o.AddAsync(domainObj))
                .Returns(Task.FromResult(domainObj));

            var mapper = new Mock<IVehicleMapper>();
            mapper.Setup(o => o.MapFromVehicleDtoToDomain(inputObj))
               .Returns(domainObj);
            mapper.Setup(o => o.MapFromDomain2Dto(domainObj))
               .Returns(inputObj);

          


            //Run the service
            var serv = new VehicleService(unitOfWork.Object, vehicleRepo.Object, mapper.Object,httpClientFactoryMock.Object);

            var result = await serv.AddAsync("Bearer 215418152",inputObj);

            Assert.Equal(inputObj.License, result.License);
            Assert.Equal(inputObj.Vin, result.Vin);
            Assert.Equal(inputObj.Date,result.Date);
            Assert.Equal(inputObj.Type,result.Type);
        }

        [Fact]
        public async void ShouldRegisterVehicle_ExceptionOcurred_VehicleTypeDoesNotExist_1()
        {
            //Request simulation variables
            string vin = "12345678901234567";
            string license = "AA-01-AA";
            string type = "VehicleTypeTT";
            string date = "2015/12/25";

            //Obtain the domain objects preentively
            VehicleDto inputObj = new VehicleDto(license, vin, type, date);
            Vehicle domainObj = new Vehicle(license, vin, type, date);

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


            var mapper = new Mock<IVehicleMapper>();
            mapper.Setup(o => o.MapFromVehicleDtoToDomain(inputObj))
                .Returns(domainObj);
            mapper.Setup(o => o.MapFromDomain2Dto(domainObj))
                .Returns(inputObj);

            var vehicleRepo = new Mock<IVehicleRepository>();
            vehicleRepo.Setup(o => o.AddAsync(domainObj))
                .Returns(Task.FromResult(domainObj));

            //Run the service
            var serv = new VehicleService(unitOfWork.Object, vehicleRepo.Object, mapper.Object, httpClientFactoryMock.Object);

            var expresult = new Exception("That type of vehicle does not exist !");

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
            //Request simulation variables
            string vin = "12345678901234567";
            string license = "AA-01-AA";
            string type = "VehicleTypeTT";
            string date = "2015/12/25";

            //Obtain the domain objects preentively
            VehicleDto inputObj = new VehicleDto(license, vin, type, date);
            Vehicle domainObj = new Vehicle(license, vin, type, date);

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

            var mapper = new Mock<IVehicleMapper>();
            mapper.Setup(o => o.MapFromVehicleDtoToDomain(inputObj))
                .Throws(error);
            mapper.Setup(o => o.MapFromDomain2Dto(domainObj))
                .Returns(inputObj);

            var vehicleRepo = new Mock<IVehicleRepository>();
            vehicleRepo.Setup(o => o.AddAsync(domainObj))
                .Returns(Task.FromResult(domainObj));


            //Run the service
            var serv = new VehicleService(unitOfWork.Object, vehicleRepo.Object, mapper.Object, httpClientFactoryMock.Object);

            var expresult = error;

            try
            {
                var result = await serv.AddAsync("Bearer 215418152",inputObj);
                Assert.True(false);
            }
            catch (Exception e)
            {
                Assert.Same(expresult, e);
            }

        }
    }
}
