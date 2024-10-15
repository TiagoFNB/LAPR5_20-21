using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DDDNetCore.Drivers.Controllers;
using DDDNetCore.Drivers.Dto;
using DDDNetCore.Drivers.Services;
using DDDNetCore.Trips.Controllers;
using DDDNetCore.Trips.Domain;
using DDDNetCore.Trips.Domain.ValueObjects;
using DDDNetCore.Trips.DTO;
using DDDNetCore.Trips.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;

namespace XUnitTestMDV.TripTest.UnitTests.Controllers
{
    public class RegisterTripControllerTest
    {

        [Fact]
        public async void ShouldRegisterTripADoc()
        {
            List<PassingTime> passing = new List<PassingTime>();
            passing.Add(new PassingTime(50));
            passing.Add(new PassingTime(55));
            string pathId = "pathId";
            string lineId = "lineId";

            //Obtain the domain objects
            RegisterTripsDto inputObj = new RegisterTripsDto(pathId, lineId, 50, 0, 0);
            ResponseTripDto outputObj = new ResponseTripDto("cantDetermine", "pathId", "lineId", passing);
            List<ResponseTripDto> listOutput = new List<ResponseTripDto>();
            listOutput.Add(outputObj);
            
            var httpContext = new DefaultHttpContext();
            httpContext.Request.Headers["Authorization"] = "test";
            var service = new Mock<IRegisterTripService>();
            service.Setup(o => o.AddAsync("test", inputObj))
                .Returns(Task.FromResult(listOutput));
            var controller = new RegisterTripController(service.Object)
            {
                ControllerContext = new ControllerContext()
                {
                    HttpContext = httpContext
                }
            };


            var result = await controller.Register(inputObj);

            //Checks if the action was completed successfully
            Assert.IsType<OkObjectResult>(result);

            OkObjectResult okRes = (OkObjectResult)result;

            List<ResponseTripDto> expResult =(List<ResponseTripDto>)okRes.Value;
            
            //Chcks if the value of the task is correct
            Assert.Same(expResult[0].PathId, outputObj.PathId);
            Assert.Same(expResult[0].LineId, outputObj.LineId);
            Assert.Equal(expResult[0].PassingTimes.Count, outputObj.PassingTimes.Count);
            Assert.Equal(expResult[0].PassingTimes[0], outputObj.PassingTimes[0]);
        }

        [Fact]
        public async void ShouldRegister2Trip()
        {
            List<PassingTime> passing = new List<PassingTime>();
            passing.Add(new PassingTime(50));
            passing.Add(new PassingTime(55));
            string pathId = "pathId";
            string lineId = "lineId";
            List<PassingTime> passing2 = new List<PassingTime>();
            passing2.Add(new PassingTime(60));
            passing2.Add(new PassingTime(65));
 

            //Obtain the domain objects
            RegisterTripsDto inputObj = new RegisterTripsDto(pathId, lineId, 50, 61, 10);
            ResponseTripDto outputObj1 = new ResponseTripDto("cantDetermine", "pathId", "lineId", passing);
            
            ResponseTripDto outputObj2 = new ResponseTripDto("cantDetermine", "pathId", "lineId", passing2);
            List<ResponseTripDto> listOutput = new List<ResponseTripDto>();
            listOutput.Add(outputObj1);
            listOutput.Add(outputObj2);

            var httpContext = new DefaultHttpContext();
            httpContext.Request.Headers["Authorization"] = "test";
            var service = new Mock<IRegisterTripService>();
            service.Setup(o => o.AddAsync("test", inputObj))
                .Returns(Task.FromResult(listOutput));
            var controller = new RegisterTripController(service.Object)
            {
                ControllerContext = new ControllerContext()
                {
                    HttpContext = httpContext
                }
            };


            var result = await controller.Register(inputObj);

            //Checks if the action was completed successfully
            Assert.IsType<OkObjectResult>(result);

            OkObjectResult okRes = (OkObjectResult)result;

            List<ResponseTripDto> expResult = (List<ResponseTripDto>)okRes.Value;

            //Chcks if the value of the task is correct
            Assert.Same(expResult[0].PathId, outputObj1.PathId);
            Assert.Same(expResult[0].LineId, outputObj1.LineId);
            Assert.Equal(expResult[0].PassingTimes.Count, outputObj1.PassingTimes.Count);
            Assert.Equal(expResult[0].PassingTimes[0], outputObj1.PassingTimes[0]);
            Assert.Same(expResult[1].PathId, outputObj2.PathId);
            Assert.Same(expResult[1].LineId, outputObj2.LineId);
            Assert.Equal(expResult[1].PassingTimes.Count, outputObj2.PassingTimes.Count);
            Assert.Equal(expResult[1].PassingTimes[0], outputObj2.PassingTimes[0]);
        }

        [Fact]
        public async void ShouldNotRegisterTrip_case1()
        {
            List<PassingTime> passing = new List<PassingTime>();
            passing.Add(new PassingTime(50));
            passing.Add(new PassingTime(55));
            string pathId = "pathId";
            string lineId = "lineId";

            //Obtain the domain objects
            RegisterTripsDto inputObj = new RegisterTripsDto(pathId, lineId, 50, 61, 10);
            ResponseTripDto outputObj1 = new ResponseTripDto("cantDetermine", "pathId", "lineId", passing);

            List<ResponseTripDto> listOutput = new List<ResponseTripDto>();
            listOutput.Add(outputObj1);

            var httpContext = new DefaultHttpContext();
            httpContext.Request.Headers["Authorization"] = "test";
            var service = new Mock<IRegisterTripService>();
            service.Setup(o => o.AddAsync("test", inputObj))
                .Throws(new InvalidOperationException(
                    "The path id indicated does not belong to the line indicated !"));
            var controller = new RegisterTripController(service.Object)
            {
                ControllerContext = new ControllerContext()
                {
                    HttpContext = httpContext
                }
            };


            var result = await controller.Register(inputObj);

            //Checks if the action was completed successfully
            Assert.IsType<ContentResult>(result);

            ContentResult okRes = (ContentResult)result;

            string expResult = (string)okRes.Content;

            //Chcks if the value of the task is correct
            Assert.Equal("The path id indicated does not belong to the line indicated !",expResult.ToString());
        }

        [Fact]
        public async void ShouldNotRegisterTrip_case2()
        {
            List<PassingTime> passing = new List<PassingTime>();
            passing.Add(new PassingTime(50));
            passing.Add(new PassingTime(55));
            string pathId = "pathId";
            string lineId = "lineId";

            //Obtain the domain objects
            RegisterTripsDto inputObj = new RegisterTripsDto(pathId, lineId, 50, 61, 10);
            ResponseTripDto outputObj1 = new ResponseTripDto("cantDetermine", "pathId", "lineId", passing);

            List<ResponseTripDto> listOutput = new List<ResponseTripDto>();
            listOutput.Add(outputObj1);

            var httpContext = new DefaultHttpContext();
            httpContext.Request.Headers["Authorization"] = "test";
            var service = new Mock<IRegisterTripService>();
            service.Setup(o => o.AddAsync("test", inputObj))
                .Throws(new InvalidOperationException("The path id indicated does not exist !"));
            var controller = new RegisterTripController(service.Object)
            {
                ControllerContext = new ControllerContext()
                {
                    HttpContext = httpContext
                }
            };


            var result = await controller.Register(inputObj);

            //Checks if the action was completed successfully
            Assert.IsType<ContentResult>(result);

            ContentResult okRes = (ContentResult)result;

            string expResult = (string)okRes.Content;

            //Chcks if the value of the task is correct
            Assert.Equal("The path id indicated does not exist !", expResult.ToString());
        }
    }
}
