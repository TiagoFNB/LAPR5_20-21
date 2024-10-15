using DDDNetCore.Trips.Domain;
using DDDNetCore.WorkBlocks.Controllers;
using DDDNetCore.WorkBlocks.Domain;
using DDDNetCore.WorkBlocks.Dto;
using DDDNetCore.WorkBlocks.Services;
using DDDSample1.Controllers;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using System;
using System.Collections.Generic;
using System.Net;
using System.Threading.Tasks;
using Xunit;


namespace XUnitTestMDV.WorkBlockTest.UnitTests.Controllers
{
    public class RegisterVehicleDutyWorkBlocksControllerTest
    {

        [Fact]
        public async void ShouldRegisterWorkBlocks_NormalSituation1()
        {
            WorkBlockDto[] wkList = new WorkBlockDto[1];

            string[] trips = new string[1];
            trips[0] = "";

            wkList[0] = new WorkBlockDto("", "1234567890","1234567890","10/01/2030", "10:30:20", "10/01/2030","10:30:20", trips);

            WorkBlockGeneratorDto input = new WorkBlockGeneratorDto(1,1,"20/01/2030","",new List<string>());
            WorkBlockGeneratedDto expResult = new WorkBlockGeneratedDto(wkList);

            var httpContext = new DefaultHttpContext();
            httpContext.Request.Headers["Authorization"] = "Bearer 215418152";

            var service = new Mock<IWorkBlocksOfVehicleDutyService>();
            service.Setup(o => o.AddAsync(It.IsAny<string>(), It.IsAny<WorkBlockGeneratorDto>()))
              .Returns(Task.FromResult(expResult));

            RegisterVehicleDutyWorkBlocksController rc = new RegisterVehicleDutyWorkBlocksController(service.Object)
            {
                ControllerContext = new ControllerContext()
                {
                    HttpContext = httpContext
                }
            };

            ActionResult<WorkBlockGeneratedDto> result = await rc.Register(input);

            //Checks if the action was completed successfully
            Assert.IsType<OkObjectResult>(result.Result);

            OkObjectResult okRes = (OkObjectResult)result.Result;

            //Chcks if the value of the task is correct
            Assert.Same(expResult, okRes.Value);
        }

        [Fact]
        public async void ShouldRegisterWorkBlocks_ExceptionOcurred_TypeAlready_1()
        {
            Exception error = new Exception("", new Exception("duplicate error"));

            ContentResult expResult = (ContentResult)APIErrorHandling.Result(HttpStatusCode.UnprocessableEntity, error.Message);

            WorkBlockDto[] wkList = new WorkBlockDto[1];

            string[] trips = new string[1];
            trips[0] = "";

            wkList[0] = new WorkBlockDto("", "1234567890", "1234567890", "10/01/2030", "10:30:20", "10/01/2030", "10:30:20", trips);

            WorkBlockGeneratorDto input = new WorkBlockGeneratorDto(1, 1, "20/01/2030", "", new List<string>());

            var httpContext = new DefaultHttpContext();
            httpContext.Request.Headers["Authorization"] = "test";

            var service = new Mock<IWorkBlocksOfVehicleDutyService>();
            service.Setup(o => o.AddAsync(It.IsAny<string>(), It.IsAny<WorkBlockGeneratorDto>()))
              .Throws(error);

            RegisterVehicleDutyWorkBlocksController rc = new RegisterVehicleDutyWorkBlocksController(service.Object)
            {
                ControllerContext = new ControllerContext()
                {
                    HttpContext = httpContext
                }
            };

            ActionResult<WorkBlockGeneratedDto> result = await rc.Register(input);

            //Checks if the action threw an error
            Assert.IsType<ContentResult>(result.Result);

            ContentResult res = (ContentResult)result.Result;

            //Chcks if the value of the task is correct
            Assert.Equal(expResult.Content, res.Content);
            Assert.Equal(expResult.ContentType, res.ContentType);
            Assert.Equal(expResult.StatusCode, res.StatusCode);
        }


        [Fact]
        public async void ShouldRegisterWorkBlocks_ExceptionOcurred_InnerException_1()
        {
            Exception error = new Exception("mainException", new Exception("Inner exception msg"));

            ContentResult expResult = (ContentResult)APIErrorHandling.Result(HttpStatusCode.BadRequest, error.InnerException.Message);

            WorkBlockDto[] wkList = new WorkBlockDto[1];

            string[] trips = new string[1];
            trips[0] = "";

            wkList[0] = new WorkBlockDto("", "1234567890", "1234567890", "10/01/2030", "10:30:20", "10/01/2030", "10:30:20", trips);

            WorkBlockGeneratorDto input = new WorkBlockGeneratorDto(1, 1, "20/01/2030", "", new List<string>());

            var httpContext = new DefaultHttpContext();
            httpContext.Request.Headers["Authorization"] = "test";

            var service = new Mock<IWorkBlocksOfVehicleDutyService>();
            service.Setup(o => o.AddAsync(It.IsAny<string>(), It.IsAny<WorkBlockGeneratorDto>()))
              .Throws(error);

            RegisterVehicleDutyWorkBlocksController rc = new RegisterVehicleDutyWorkBlocksController(service.Object)
            {
                ControllerContext = new ControllerContext()
                {
                    HttpContext = httpContext
                }
            };

            ActionResult<WorkBlockGeneratedDto> result = await rc.Register(input);

            //Checks if the action threw an error
            Assert.IsType<ContentResult>(result.Result);

            ContentResult res = (ContentResult)result.Result;

            //Chcks if the value of the task is correct
            Assert.Equal(expResult.Content, res.Content);
            Assert.Equal(expResult.ContentType, res.ContentType);
            Assert.Equal(expResult.StatusCode, res.StatusCode);
        }

        [Fact]
        public async void ShouldRegisterWorkBlocks_ExceptionOcurred_Other_1()
        {
            Exception error = new Exception("something error");

            ContentResult expResult = (ContentResult)APIErrorHandling.Result(HttpStatusCode.BadRequest, error.Message);

            WorkBlockDto[] wkList = new WorkBlockDto[1];

            string[] trips = new string[1];
            trips[0] = "";

            wkList[0] = new WorkBlockDto("", "1234567890", "1234567890", "10/01/2030", "10:30:20", "10/01/2030", "10:30:20", trips);

            WorkBlockGeneratorDto input = new WorkBlockGeneratorDto(1, 1, "20/01/2030", "", new List<string>());

            var httpContext = new DefaultHttpContext();
            httpContext.Request.Headers["Authorization"] = "test";

            var service = new Mock<IWorkBlocksOfVehicleDutyService>();
            service.Setup(o => o.AddAsync(It.IsAny<string>(), It.IsAny<WorkBlockGeneratorDto>()))
              .Throws(error);

            RegisterVehicleDutyWorkBlocksController rc = new RegisterVehicleDutyWorkBlocksController(service.Object)
            {
                ControllerContext = new ControllerContext()
                {
                    HttpContext = httpContext
                }
            };

            ActionResult<WorkBlockGeneratedDto> result = await rc.Register(input);

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
