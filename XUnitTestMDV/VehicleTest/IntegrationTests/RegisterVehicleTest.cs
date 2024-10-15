using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using DDDNetCore.VehicleDuties.Services;
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

namespace XUnitTestMDV.VehicleTest.IntegrationTests
{
    public class RegisterVehicleTest
    {
        [Fact]
        public async void ShouldRegisterVehicle()
        {
            //Request simulation variables
            string vin = "12345678901234567";
            string license = "AA-01-AA";
            string type = "VehicleTypeTT";
            string date = "2015/12/25";

            //Obtain the domain objects preentively
            VehicleDto inputObj = new VehicleDto(license, vin, type, date);
            Vehicle domainObj = new Vehicle(license, vin, type, date);
            VehicleDto expResult = inputObj;

            //Mock dependencies
            var unitOfWork = new Mock<IUnitOfWork>();
            unitOfWork.Setup(o => o.CommitAsync())
                .Returns(Task.FromResult(200));

            var mapper = new VehicleMapper();

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
            vehicleRepo.Setup(o => o.AddAsync(It.IsAny<Vehicle>()))
                .Returns(Task.FromResult(domainObj));


            //Run the test
            VehicleService serv = new VehicleService(unitOfWork.Object, vehicleRepo.Object, mapper, httpClientFactoryMock.Object);

            var httpContext = new DefaultHttpContext();
            httpContext.Request.Headers["Authorization"] = "test1 test";

            RegisterVehicleController controller = new RegisterVehicleController(serv)
            {
                ControllerContext = new ControllerContext()
                {
                    HttpContext = httpContext
                }
            };





            var result = await controller.Register(inputObj);

            Assert.IsType<OkObjectResult>(result.Result);

            OkObjectResult okRes = (OkObjectResult)result.Result;
            VehicleDto res = (VehicleDto)okRes.Value;

            //Chcks if the value of the task is correct
            Assert.Equal(inputObj.License, res.License);
            Assert.Equal(inputObj.Date, res.Date);
            Assert.Equal(inputObj.Type, res.Type);
            Assert.Equal(inputObj.Vin, res.Vin);

        }

        [Fact]
        public async void ShouldRegisterVehicleDuty_ExceptionOcurred_TypeAlready_1()
        {
            //Request simulation variables
            string vin = "12345678901234567";
            string license = "AA-01-AA";
            string type = "VehicleTypeTT";
            string date = "2015/12/25";

            //Obtain the domain objects preentively
            VehicleDto inputObj = new VehicleDto(license, vin, type, date);
            Vehicle domainObj = new Vehicle(license, vin, type, date);
            VehicleDto expResult = inputObj;

            //Mock dependencies
            var unitOfWork = new Mock<IUnitOfWork>();
            unitOfWork.Setup(o => o.CommitAsync())
                .Returns(Task.FromResult(200));

            var mapper = new VehicleMapper();

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
            vehicleRepo.Setup(o => o.AddAsync(It.IsAny<Vehicle>()))
                .Throws(new Exception("duplicate exists",  new Exception("duplicate exists")));


            //Run the test
            var serv = new VehicleService(unitOfWork.Object, vehicleRepo.Object, mapper, httpClientFactoryMock.Object);

            var httpContext = new DefaultHttpContext();
            httpContext.Request.Headers["Authorization"] = "test1 test";
            
            var controller = new RegisterVehicleController(serv)
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
        public async void ShouldRegisterVehicleDuty_ExceptionOcurred_TypeOther_1()
        {
            //Request simulation variables
            string vin = "123456789012345";
            string license = "AA-01-AA";
            string type = "VehicleTypeTT";
            string date = "2015/12/25";

            //Obtain the domain objects preentively
            VehicleDto inputObj = new VehicleDto(license, vin, type, date);
           
            VehicleDto expResult = inputObj;

            //Mock dependencies
            var unitOfWork = new Mock<IUnitOfWork>();
            unitOfWork.Setup(o => o.CommitAsync())
                .Returns(Task.FromResult(200));

            var mapper = new VehicleMapper();

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
            


            //Run the test
            var serv = new VehicleService(unitOfWork.Object, vehicleRepo.Object, mapper, httpClientFactoryMock.Object);

            var httpContext = new DefaultHttpContext();
            httpContext.Request.Headers["Authorization"] = "test1 test";
            
           
            var controller = new RegisterVehicleController(serv)
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
            Assert.Equal("VIN must be 17 characters long", res.Content);
            Assert.Equal("Json", res.ContentType);
            Assert.Equal(400, res.StatusCode);
        }
    }
}
