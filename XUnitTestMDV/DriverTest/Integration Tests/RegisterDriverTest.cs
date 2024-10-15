using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using DDDNetCore.Drivers.Controllers;
using DDDNetCore.Drivers.Domain;
using DDDNetCore.Drivers.Dto;
using DDDNetCore.Drivers.Mappers;
using DDDNetCore.Drivers.Repository;
using DDDNetCore.Drivers.Services;
using DDDNetCore.Vehicles.Controllers;
using DDDNetCore.Vehicles.Domain;
using DDDNetCore.Vehicles.Dto;
using DDDNetCore.Vehicles.Mappers;
using DDDNetCore.Vehicles.Repository;
using DDDNetCore.Vehicles.Services;
using DDDSample1.Domain.Shared;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Moq.Protected;
using Xunit;

namespace XUnitTestMDV.DriverTest.Integration_Tests
{
    public class RegisterDriverTest
    {
        [Fact]
        public async void ShouldRegisterDriver()
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


            DriverDto expResult = inputObj;

            //Mock dependencies
            var unitOfWork = new Mock<IUnitOfWork>();
            unitOfWork.Setup(o => o.CommitAsync())
                .Returns(Task.FromResult(200));

            var mapper = new DriverMapper();

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
            driverRepo.Setup(o => o.AddAsync(It.IsAny<Driver>()))
                .Returns(Task.FromResult(domainObj));


            //Run the test
            DriverService serv = new DriverService(unitOfWork.Object, driverRepo.Object, mapper, httpClientFactoryMock.Object);

            var httpContext = new DefaultHttpContext();
            httpContext.Request.Headers["Authorization"] = "test1 test";

            RegisterDriverController controller = new RegisterDriverController(serv)
            {
                ControllerContext = new ControllerContext()
                {
                    HttpContext = httpContext
                }
            };





            var res = await controller.Register(inputObj);

            Assert.IsType<OkObjectResult>(res.Result);

            OkObjectResult okRes = (OkObjectResult)res.Result;
            DriverDto result = (DriverDto)okRes.Value;

            //Chcks if the value of the task is correct
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
        public async void ShouldRegisterDriver_ExceptionOcurred_TypeAlready_1()
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

            
            DriverDto inputObj = new DriverDto(MechanographicNumber, Name, BirthDate, CitizenCardNumber, EntryDate, DepartureDate, FiscalNumber, Type, License, LicenseDate);


            DriverDto expResult = inputObj;

            //Mock dependencies
            var unitOfWork = new Mock<IUnitOfWork>();
            unitOfWork.Setup(o => o.CommitAsync())
                .Returns(Task.FromResult(200));

            var mapper = new DriverMapper();

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
            driverRepo.Setup(o => o.AddAsync(It.IsAny<Driver>()))
                .Throws(new Exception("",new Exception("duplicate exists")));


            //Run the test
            var serv = new DriverService(unitOfWork.Object, driverRepo.Object, mapper, httpClientFactoryMock.Object);

            var httpContext = new DefaultHttpContext();
            httpContext.Request.Headers["Authorization"] = "test1 test";

            var controller = new RegisterDriverController(serv)
            {
                ControllerContext = new ControllerContext()
                {
                    HttpContext = httpContext
                }
            };
            var result = await controller.Register(inputObj);

            //Checks if the action threw an error
            Assert.IsType<ContentResult>(result.Result);

            ContentResult res = (ContentResult)result.Result;

            //Chcks if the value of the task is correct
            Assert.Equal("duplicate exists", res.Content);
            Assert.Equal("Json", res.ContentType);
            Assert.Equal(422, res.StatusCode);
        }

        [Fact]
        public async void ShouldNotRegisterDriver_ExceptionOcurred_TypeOther_1()
        {
            string MechanographicNumber = "12345678900";
            string Name = "jajaja1";
            string BirthDate = "2000/06/28";
            string CitizenCardNumber = "12345678";
            string EntryDate = "2020/11/20";
            string DepartureDate = "2020/11/21";
            string FiscalNumber = "123456789";
            string Type = "PandaKungFu";


            string License = "P-564681651 A";
            string LicenseDate = "2020/11/20";

            
            DriverDto inputObj = new DriverDto(MechanographicNumber, Name, BirthDate, CitizenCardNumber, EntryDate, DepartureDate, FiscalNumber, Type, License, LicenseDate);


            DriverDto expResult = inputObj;

            //Mock dependencies
            var unitOfWork = new Mock<IUnitOfWork>();
            unitOfWork.Setup(o => o.CommitAsync())
                .Returns(Task.FromResult(200));

            var mapper = new DriverMapper();

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



            //Run the test
            var serv = new DriverService(unitOfWork.Object, driverRepo.Object, mapper, httpClientFactoryMock.Object);

            var httpContext = new DefaultHttpContext();
            httpContext.Request.Headers["Authorization"] = "test1 test";


            var controller = new RegisterDriverController(serv)
            {
                ControllerContext = new ControllerContext()
                {
                    HttpContext = httpContext
                }
            };
            var result = await controller.Register(inputObj);

            //Checks if the action threw an error
            Assert.IsType<ContentResult>(result.Result);

            ContentResult res = (ContentResult)result.Result;



            //Chcks if the value of the task is correct
            Assert.Equal("DriverMechanographicNumber must be 9 characters long", res.Content);
            Assert.Equal("Json", res.ContentType);
            Assert.Equal(400, res.StatusCode);
        }
    }
}
