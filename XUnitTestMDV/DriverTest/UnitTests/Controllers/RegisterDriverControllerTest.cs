using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using DDDNetCore.Drivers.Controllers;
using DDDNetCore.Drivers.Dto;
using DDDNetCore.Drivers.Services;
using DDDNetCore.Vehicles.Controllers;
using DDDNetCore.Vehicles.Dto;
using DDDNetCore.Vehicles.Services;
using DDDSample1.Controllers;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;

namespace XUnitTestMDV.DriverTest.UnitTests.Controllers
{
    public class RegisterDriverControllerTest
    {
        [Fact]
        public async void ShouldRegisterDriver_NormalSituation1()
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



            DriverDto input = new DriverDto(MechanographicNumber, Name, BirthDate, CitizenCardNumber, EntryDate, DepartureDate, FiscalNumber, Type, License, LicenseDate);
            DriverDto expResult = input;


            var httpContext = new DefaultHttpContext();
            httpContext.Request.Headers["Authorization"] = "test";
            var service = new Mock<IDriverService>();
            service.Setup(o => o.AddAsync("test", input))
              .Returns(Task.FromResult(input));
            var controller = new RegisterDriverController(service.Object)
            {
                ControllerContext = new ControllerContext()
                {
                    HttpContext = httpContext
                }
            };





            ActionResult<DriverDto> result = await controller.Register(input);

            //Checks if the action was completed successfully
            Assert.IsType<OkObjectResult>(result.Result);

            OkObjectResult okRes = (OkObjectResult)result.Result;

            //Chcks if the value of the task is correct
            Assert.Same(expResult, okRes.Value);
        }



        [Fact]
        public async void ShouldRegisterDriver_ExceptionOcurred_DriverAlreadyExists_1()
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



            DriverDto input = new DriverDto(MechanographicNumber, Name, BirthDate, CitizenCardNumber, EntryDate, DepartureDate, FiscalNumber, Type, License, LicenseDate);


            Exception error = new Exception("duplicate error", new Exception("duplicate error"));

            ContentResult expResult = (ContentResult)APIErrorHandling.Result(HttpStatusCode.UnprocessableEntity, error.Message);

            var httpContext = new DefaultHttpContext();
            httpContext.Request.Headers["Authorization"] = "test";
            var service = new Mock<IDriverService>();
            service.Setup(o => o.AddAsync("test", input))
                .Throws(error);
            var controller = new RegisterDriverController(service.Object)
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
        public async void ShouldRegisterDriver_ExceptionOcurred_InnerException_1()
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



            DriverDto input = new DriverDto(MechanographicNumber, Name, BirthDate, CitizenCardNumber, EntryDate, DepartureDate, FiscalNumber, Type,License,LicenseDate);

            Exception error = new Exception("mainException", new Exception("Inner exception msg"));

            ContentResult expResult = (ContentResult)APIErrorHandling.Result(HttpStatusCode.BadRequest, error.InnerException.Message);

            var httpContext = new DefaultHttpContext();
            httpContext.Request.Headers["Authorization"] = "test";
            var service = new Mock<IDriverService>();
            service.Setup(o => o.AddAsync("test", input))
                .Throws(error);
            var controller = new RegisterDriverController(service.Object)
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
        public async void ShouldRegisterDriver_ExceptionOcurred_Other_1()
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



            DriverDto input = new DriverDto(MechanographicNumber, Name, BirthDate, CitizenCardNumber, EntryDate, DepartureDate, FiscalNumber, Type, License, LicenseDate);

            Exception error = new Exception("something error");

            ContentResult expResult = (ContentResult)APIErrorHandling.Result(HttpStatusCode.BadRequest, error.Message);

            var httpContext = new DefaultHttpContext();
            httpContext.Request.Headers["Authorization"] = "test";
            var service = new Mock<IDriverService>();
            service.Setup(o => o.AddAsync("test", input))
                .Throws(error);
            var controller = new RegisterDriverController(service.Object)
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
