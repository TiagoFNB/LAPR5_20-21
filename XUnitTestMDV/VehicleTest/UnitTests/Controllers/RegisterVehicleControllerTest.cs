using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using DDDNetCore.VehicleDuties.Controllers;
using DDDNetCore.VehicleDuties.Dto;
using DDDNetCore.VehicleDuties.Services;
using DDDNetCore.Vehicles.Controllers;
using DDDNetCore.Vehicles.Dto;
using DDDNetCore.Vehicles.Services;
using DDDSample1.Controllers;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;

namespace XUnitTestMDV.VehicleTest.UnitTests.Controllers
{
    public class RegisterVehicleControllerTest
    {
        [Fact]
        public async void ShouldRegisterVehicle_NormalSituation1()
        {

            

            VehicleDto input = new VehicleDto("AA-01-AA", "12345678901234567", "VehicleTypeTT", "2015/12/25");
            VehicleDto expResult = input;
            
            
            var httpContext = new DefaultHttpContext();
            httpContext.Request.Headers["Authorization"] = "test";
            var service = new Mock<IVehicleService>();
            service.Setup(o => o.AddAsync("test",input))
              .Returns(Task.FromResult(input));
            var controller = new RegisterVehicleController(service.Object)
            {
                ControllerContext = new ControllerContext()
                {
                    HttpContext = httpContext
                }
            };
            

            

            
            ActionResult<VehicleDto> result = await controller.Register(input);

            //Checks if the action was completed successfully
            Assert.IsType<OkObjectResult>(result.Result);

            OkObjectResult okRes = (OkObjectResult)result.Result;

            //Chcks if the value of the task is correct
            Assert.Same(expResult, okRes.Value);
        }



        [Fact]
        public async void ShouldRegisterVehicle_ExceptionOcurred_VehicleAlreadyExists_1()
        {
            

            VehicleDto input = new VehicleDto("AA-01-AA", "12345678901234567", "VehicleTypeTT", "2015/12/25");
           

            Exception error = new Exception("duplicate error", new Exception("duplicate error"));

            ContentResult expResult = (ContentResult)APIErrorHandling.Result(HttpStatusCode.UnprocessableEntity, error.Message);

            var httpContext = new DefaultHttpContext();
            httpContext.Request.Headers["Authorization"] = "test";
            var service = new Mock<IVehicleService>();
            service.Setup(o => o.AddAsync("test", input))
                .Throws(error);
            var controller = new RegisterVehicleController(service.Object)
            {
                ControllerContext = new ControllerContext()
                {
                    HttpContext = httpContext
                }
            };





           var result = await controller.Register(input);
           

            //Checks if the action threw an error
            Assert.IsType<ContentResult>(result.Result);

            ContentResult res = (ContentResult)result.Result;

            //Chcks if the value of the task is correct
            Assert.Equal(expResult.Content, res.Content);
            Assert.Equal(expResult.ContentType, res.ContentType);
            Assert.Equal(expResult.StatusCode, res.StatusCode);
        }

        [Fact]
        public async void ShouldRegisterVehicle_ExceptionOcurred_InnerException_1()
        {
            VehicleDto input = new VehicleDto("AA-01-AA", "12345678901234567", "VehicleTypeTT", "2015/12/25");

            Exception error = new Exception("mainException", new Exception("Inner exception msg"));

            ContentResult expResult = (ContentResult)APIErrorHandling.Result(HttpStatusCode.BadRequest, error.InnerException.Message);

            var httpContext = new DefaultHttpContext();
            httpContext.Request.Headers["Authorization"] = "test";
            var service = new Mock<IVehicleService>();
            service.Setup(o => o.AddAsync("test", input))
                .Throws(error);
            var controller = new RegisterVehicleController(service.Object)
            {
                ControllerContext = new ControllerContext()
                {
                    HttpContext = httpContext
                }
            };





            var result = await controller.Register(input);

            //Checks if the action threw an error
            Assert.IsType<ContentResult>(result.Result);

            ContentResult res = (ContentResult)result.Result;

            //Chcks if the value of the task is correct
            Assert.Equal(expResult.Content, res.Content);
            Assert.Equal(expResult.ContentType, res.ContentType);
            Assert.Equal(expResult.StatusCode, res.StatusCode);
        }

        [Fact]
        public async void ShouldRegisterVehicle_ExceptionOcurred_Other_1()
        {
            VehicleDto input = new VehicleDto("AA-01-AA", "12345678901234567", "VehicleTypeTT", "2015/12/25");

            Exception error = new Exception("something error");

            ContentResult expResult = (ContentResult)APIErrorHandling.Result(HttpStatusCode.BadRequest, error.Message);

            var httpContext = new DefaultHttpContext();
            httpContext.Request.Headers["Authorization"] = "test";
            var service = new Mock<IVehicleService>();
            service.Setup(o => o.AddAsync("test", input))
                .Throws(error);
            var controller = new RegisterVehicleController(service.Object)
            {
                ControllerContext = new ControllerContext()
                {
                    HttpContext = httpContext
                }
            };





            var result = await controller.Register(input);

            //Checks if the action threw an error
            Assert.IsType<ContentResult>(result.Result);

            ContentResult res = (ContentResult)result.Result;

            //Chcks if the value of the task is correct
            Assert.Equal(expResult.Content, res.Content);
            Assert.Equal(expResult.ContentType, res.ContentType);
            Assert.Equal(expResult.StatusCode, res.StatusCode);
        }
    }
}
