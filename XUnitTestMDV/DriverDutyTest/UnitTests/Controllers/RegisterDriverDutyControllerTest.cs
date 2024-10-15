using DDDNetCore.DriverDuties.Controllers;
using DDDNetCore.DriverDuties.Dto;
using DDDNetCore.DriverDuties.Services;
using DDDSample1.Controllers;
using Microsoft.AspNetCore.Mvc;
using Moq;
using System;
using System.Net;
using System.Threading.Tasks;
using Xunit;

namespace XUnitTestMDV.DriverDutyTest.UnitTests.Controller
{
    public class RegisterDriverDutyControllerTest
    {

        [Fact]
        public async void ShouldRegisterDriverDuty_NormalSituation1()
        {
            DriverDutyDto input = new DriverDutyDto("drivDutyt1","DutyDriv1");
            DriverDutyDto expResult = input;

            var service = new Mock<IDriverDutyService>();
            service.Setup(o => o.AddAsync(input))
              .Returns(Task.FromResult(input));

            RegisterDriverDutyController rc = new RegisterDriverDutyController(service.Object);
            ActionResult<DriverDutyDto> result = await rc.Register(input);

            //Checks if the action was completed successfully
            Assert.IsType<OkObjectResult>(result.Result);

            OkObjectResult okRes = (OkObjectResult)result.Result;

            //Chcks if the value of the task is correct
            Assert.Same(expResult, okRes.Value);
        }

        [Fact]
        public async void ShouldRegisterDriverDuty_NormalSituation2()
        {
            DriverDutyDto input = new DriverDutyDto("drivDutyt2", "DutyDriv2");
            DriverDutyDto expResult = input;

            var service = new Mock<IDriverDutyService>();
            service.Setup(o => o.AddAsync(input))
              .Returns(Task.FromResult(input));

            RegisterDriverDutyController rc = new RegisterDriverDutyController(service.Object);
            ActionResult<DriverDutyDto> result = await rc.Register(input);

            //Checks if the action was completed successfully
            Assert.IsType<OkObjectResult>(result.Result);

            OkObjectResult okRes = (OkObjectResult)result.Result;

            //Chcks if the value of the task is correct
            Assert.Same(expResult, okRes.Value);
        }

        [Fact]
        public async void ShouldRegisterDriverDuty_ExceptionOcurred_TypeAlready_1()
        {
            DriverDutyDto input = new DriverDutyDto("drivDutyt2", "DutyDriv2");

            Exception error = new Exception("", new Exception("duplicate error"));

            ContentResult expResult = (ContentResult)APIErrorHandling.Result(HttpStatusCode.UnprocessableEntity, error.Message);

            var service = new Mock<IDriverDutyService>();
            service.Setup(o => o.AddAsync(input))
              .Throws(error);

            RegisterDriverDutyController rc = new RegisterDriverDutyController(service.Object);
            var result = await rc.Register(input);

            //Checks if the action threw an error
            Assert.IsType<ContentResult>(result.Result);

            ContentResult res = (ContentResult) result.Result;

            //Chcks if the value of the task is correct
            Assert.Equal(expResult.Content, res.Content);
            Assert.Equal(expResult.ContentType, res.ContentType);
            Assert.Equal(expResult.StatusCode, res.StatusCode);
        }

        [Fact]
        public async void ShouldRegisterDriverDuty_ExceptionOcurred_InnerException_1()
        {
            DriverDutyDto input = new DriverDutyDto("drivDutyt2", "DutyDriv2");

            Exception error = new Exception("mainException", new Exception("Inner exception msg"));

            ContentResult expResult = (ContentResult)APIErrorHandling.Result(HttpStatusCode.BadRequest, error.InnerException.Message);

            var service = new Mock<IDriverDutyService>();
            service.Setup(o => o.AddAsync(input))
              .Throws(error);

            RegisterDriverDutyController rc = new RegisterDriverDutyController(service.Object);
            var result = await rc.Register(input);

            //Checks if the action threw an error
            Assert.IsType<ContentResult>(result.Result);

            ContentResult res = (ContentResult)result.Result;

            //Chcks if the value of the task is correct
            Assert.Equal(expResult.Content, res.Content);
            Assert.Equal(expResult.ContentType, res.ContentType);
            Assert.Equal(expResult.StatusCode, res.StatusCode);
        }

        [Fact]
        public async void ShouldRegisterDriverDuty_ExceptionOcurred_Other_1()
        {
            DriverDutyDto input = new DriverDutyDto("drivDutyt2", "DutyDriv2");

            Exception error = new Exception("something error");

            ContentResult expResult = (ContentResult)APIErrorHandling.Result(HttpStatusCode.BadRequest, error.Message);

            var service = new Mock<IDriverDutyService>();
            service.Setup(o => o.AddAsync(input))
              .Throws(error);

            RegisterDriverDutyController rc = new RegisterDriverDutyController(service.Object);
            var result = await rc.Register(input);

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
