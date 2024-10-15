using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using DDDNetCore.VehicleDuties.Controllers;
using DDDNetCore.VehicleDuties.Dto;
using DDDNetCore.VehicleDuties.Services;
using DDDSample1.Controllers;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;

namespace XUnitTestMDV.VehicleDutyTest.UnitTests.Controllers
{
    public class RegisterVehicleDutyControllerTest
    {
       

            [Fact]
            public async void ShouldRegisterVehicleDuty_NormalSituation1()
            {
                VehicleDutyDto input = new VehicleDutyDto("vehicleDutyt1", "XX-01-XX");
                VehicleDutyDto expResult = input;

                var service = new Mock<IVehicleDutyService>();
                service.Setup(o => o.AddAsync(input))
                  .Returns(Task.FromResult(input));

                RegisterVehicleDutyController rc = new RegisterVehicleDutyController(service.Object);
                ActionResult<VehicleDutyDto> result = await rc.Register(input);

                //Checks if the action was completed successfully
                Assert.IsType<OkObjectResult>(result.Result);

                OkObjectResult okRes = (OkObjectResult)result.Result;

                //Chcks if the value of the task is correct
                Assert.Same(expResult, okRes.Value);
            }

            [Fact]
            public async void ShouldRegisterVehicleDuty_NormalSituation2()
            {
                VehicleDutyDto input = new VehicleDutyDto("vehicleDutyt2", "XX-02-XX");
                VehicleDutyDto expResult = input;

                var service = new Mock<IVehicleDutyService>();
                service.Setup(o => o.AddAsync(input))
                  .Returns(Task.FromResult(input));

            RegisterVehicleDutyController rc = new RegisterVehicleDutyController(service.Object);
                ActionResult<VehicleDutyDto> result = await rc.Register(input);

                //Checks if the action was completed successfully
                Assert.IsType<OkObjectResult>(result.Result);

                OkObjectResult okRes = (OkObjectResult)result.Result;

                //Chcks if the value of the task is correct
                Assert.Same(expResult, okRes.Value);
            }

            [Fact]
            public async void ShouldRegisterVehicleDuty_ExceptionOcurred_TypeAlready_1()
            {
                VehicleDutyDto input = new VehicleDutyDto("vehicleDutyt3", "XX-03-XX");

                Exception error = new Exception("duplicate error", new Exception("duplicate error"));

                ContentResult expResult = (ContentResult)APIErrorHandling.Result(HttpStatusCode.UnprocessableEntity, error.Message);

                var service = new Mock<IVehicleDutyService>();
                service.Setup(o => o.AddAsync(input))
                  .Throws(error);

            RegisterVehicleDutyController rc = new RegisterVehicleDutyController(service.Object);
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
            public async void ShouldRegisterVehicleDuty_ExceptionOcurred_InnerException_1()
            {
                VehicleDutyDto input = new VehicleDutyDto("vehicleDutyt4", "XX-04-XX");

                Exception error = new Exception("mainException", new Exception("Inner exception msg"));

                ContentResult expResult = (ContentResult)APIErrorHandling.Result(HttpStatusCode.BadRequest, error.InnerException.Message);

                var service = new Mock<IVehicleDutyService>();
                service.Setup(o => o.AddAsync(input))
                  .Throws(error);

            RegisterVehicleDutyController rc = new RegisterVehicleDutyController(service.Object);
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
            public async void ShouldRegisterVehicleDuty_ExceptionOcurred_Other_1()
            {
                VehicleDutyDto input = new VehicleDutyDto("vehicleDutyt5", "XX-05-XX");

                Exception error = new Exception("something error");

                ContentResult expResult = (ContentResult)APIErrorHandling.Result(HttpStatusCode.BadRequest, error.Message);

                var service = new Mock<IVehicleDutyService>();
                service.Setup(o => o.AddAsync(input))
                  .Throws(error);

            RegisterVehicleDutyController rc = new RegisterVehicleDutyController(service.Object);
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


