using DDDNetCore.DriverDuties.Controllers;
using DDDNetCore.DriverDuties.Domain;
using DDDNetCore.DriverDuties.Dto;
using DDDNetCore.DriverDuties.Mappers;
using DDDNetCore.DriverDuties.Repository;
using DDDNetCore.DriverDuties.Services;
using DDDSample1.Controllers;
using Microsoft.AspNetCore.Mvc;
using Moq;
using System;
using System.Collections.Generic;
using System.Net;
using System.Threading.Tasks;
using Xunit;

namespace XUnitTestMDV.DriverDutyTest.IntegrationTests
{
    public class GetListDriverDutiesTest
    {
        [Fact]
        public async void ShouldRegisterDriverDuty_NormalSituation()
        {
            string DdtCode1 = "1234567890";
            string DdMecCode1 = "123456789";

            string DdtCode2 = "hhhhhhhhhh";
            string DdMecCode2 = "hhhhhhhhh";


            List<DriverDutyDto> output = new List<DriverDutyDto>();
            output.Add(new DriverDutyDto(DdtCode1, DdMecCode1));
            output.Add(new DriverDutyDto(DdtCode2, DdMecCode2));



            List<DriverDuty> repoRes = new List<DriverDuty>();
            repoRes.Add(new DriverDuty(DdtCode1, DdMecCode1));
            repoRes.Add(new DriverDuty(DdtCode2, DdMecCode2));

            //Mock dependencies
            var driverDutyRepo = new Mock<IDriverDutyRepository>();
            driverDutyRepo.Setup(o => o.GetAllAsync())
               .Returns(Task.FromResult(repoRes));

            //Run the service
            var service = new ListDriverDutiesService(driverDutyRepo.Object,new DriverDutyMapper());

            GetListDriverDutiesController rc = new GetListDriverDutiesController(service);

            ActionResult<DriverDutyDto> result = (ActionResult)await rc.List();

            //Checks if the action was completed successfully
            Assert.IsType<OkObjectResult>(result.Result);

            OkObjectResult okRes = (OkObjectResult)result.Result;
            List<DriverDutyDto> value = (List<DriverDutyDto>) okRes.Value;

            //Chcks if the value of the task is correct
            for(int i = 0; i < output.Count; i++)
            {
                Assert.Equal(output[i].DriverDutyCode, value[i].DriverDutyCode);
                Assert.Equal(output[i].DriverMecNumber, value[i].DriverMecNumber);
            }
            
        }


        [Fact]
        public async void ShouldRegisterDriverDuty_NormalSituation2_EmptyList()
        {
            List<DriverDutyDto> output = new List<DriverDutyDto>();

            List<DriverDuty> repoRes = new List<DriverDuty>();

            //Mock dependencies
            var driverDutyRepo = new Mock<IDriverDutyRepository>();
            driverDutyRepo.Setup(o => o.GetAllAsync())
               .Returns(Task.FromResult(repoRes));

            //Run the service
            var service = new ListDriverDutiesService(driverDutyRepo.Object, new DriverDutyMapper());

            GetListDriverDutiesController rc = new GetListDriverDutiesController(service);

            ActionResult<DriverDutyDto> result = (ActionResult)await rc.List();

            //Checks if the action was completed successfully
            Assert.IsType<OkObjectResult>(result.Result);

            OkObjectResult okRes = (OkObjectResult)result.Result;
            List<DriverDutyDto> value = (List<DriverDutyDto>)okRes.Value;

            //Chcks if the value of the task is correct
            for (int i = 0; i < output.Count; i++)
            {
                Assert.Equal(output[i].DriverDutyCode, value[i].DriverDutyCode);
                Assert.Equal(output[i].DriverMecNumber, value[i].DriverMecNumber);
            }

        }


        [Fact]
        public async void ShouldRegisterDriverDuty_Error_RepoUnknownError()
        {
            List<DriverDutyDto> output = new List<DriverDutyDto>();

            List<DriverDuty> repoRes = new List<DriverDuty>();

            Exception error = new Exception("", new Exception("Unknown Error"));

            ContentResult expResult = (ContentResult)APIErrorHandling.Result(HttpStatusCode.BadRequest, error.InnerException.Message);


            //Mock dependencies
            var driverDutyRepo = new Mock<IDriverDutyRepository>();
            driverDutyRepo.Setup(o => o.GetAllAsync())
               .Throws(error);

            //Run the service
            var service = new ListDriverDutiesService(driverDutyRepo.Object, new DriverDutyMapper());

            GetListDriverDutiesController rc = new GetListDriverDutiesController(service);

            ActionResult<DriverDutyDto> result = (ActionResult)await rc.List();

            //Checks if the action was completed successfully
            Assert.IsType<ContentResult>(result.Result);

            ContentResult res = (ContentResult)result.Result;

            //Chcks if the value of the task is correct
            Assert.Equal(expResult.Content, res.Content);
            Assert.Equal(expResult.ContentType, res.ContentType);
            Assert.Equal(expResult.StatusCode, res.StatusCode);

        }
    }
}
