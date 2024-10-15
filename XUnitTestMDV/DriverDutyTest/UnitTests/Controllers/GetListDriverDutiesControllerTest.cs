using DDDNetCore.DriverDuties.Controllers;
using DDDNetCore.DriverDuties.Dto;
using DDDNetCore.DriverDuties.Services;
using DDDSample1.Controllers;
using Microsoft.AspNetCore.Mvc;
using Moq;
using System;
using System.Collections.Generic;
using System.Net;
using System.Threading.Tasks;
using Xunit;

namespace XUnitTestMDV.DriverDutyTest.UnitTests.Controllers
{
    public class GetListDriverDutiesControllerTest
    {

        [Fact]
        public async void ShouldRegisterDriverDuty_NormalSituation1_EmptyList()
        {
            List<DriverDutyDto> output = new List<DriverDutyDto>();

            var service = new Mock<IListDriverDutiesService>();
            service.Setup(o => o.GetAllAsync())
              .Returns(Task.FromResult(output));

            GetListDriverDutiesController rc = new GetListDriverDutiesController(service.Object);

            ActionResult<DriverDutyDto> result =(ActionResult) await rc.List();

            //Checks if the action was completed successfully
            Assert.IsType<OkObjectResult>(result.Result);

            OkObjectResult okRes = (OkObjectResult)result.Result;

            //Chcks if the value of the task is correct
            Assert.Same(output, okRes.Value);
        }

        [Fact]
        public async void ShouldRegisterDriverDuty_NormalSituation2()
        {
            List<DriverDutyDto> output = new List<DriverDutyDto>();
            output.Add(new DriverDutyDto(""));

            var service = new Mock<IListDriverDutiesService>();
            service.Setup(o => o.GetAllAsync())
              .Returns(Task.FromResult(output));

            GetListDriverDutiesController rc = new GetListDriverDutiesController(service.Object);

            ActionResult<DriverDutyDto> result = (ActionResult)await rc.List();

            //Checks if the action was completed successfully
            Assert.IsType<OkObjectResult>(result.Result);

            OkObjectResult okRes = (OkObjectResult)result.Result;

            //Chcks if the value of the task is correct
            Assert.Same(output, okRes.Value);
        }

        [Fact]
        public async void ShouldRegisterDriverDuty_UnknownError1()
        {
            List<DriverDutyDto> output = new List<DriverDutyDto>();
            output.Add(new DriverDutyDto(""));

            Exception error = new Exception("", new Exception("Unknown Error"));

            ContentResult expResult = (ContentResult)APIErrorHandling.Result(HttpStatusCode.BadRequest, error.InnerException.Message);

            var service = new Mock<IListDriverDutiesService>();
            service.Setup(o => o.GetAllAsync())
              .Throws(error);

            GetListDriverDutiesController rc = new GetListDriverDutiesController(service.Object);

            ActionResult<DriverDutyDto> result = (ActionResult)await rc.List();

            //Checks if the action was completed successfully
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
