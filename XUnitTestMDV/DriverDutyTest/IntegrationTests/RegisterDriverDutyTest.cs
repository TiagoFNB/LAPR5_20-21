using DDDNetCore.DriverDuties.Controllers;
using DDDNetCore.DriverDuties.Domain;
using DDDNetCore.DriverDuties.Dto;
using DDDNetCore.DriverDuties.Mappers;
using DDDNetCore.DriverDuties.Repository;
using DDDNetCore.DriverDuties.Services;
using DDDNetCore.Drivers.Domain;
using DDDNetCore.Drivers.Domain.ValueObjects;
using DDDNetCore.Drivers.Repository;
using DDDNetCore.WorkBlocks.Domain;
using DDDNetCore.WorkBlocks.Domain.ValueObjects;
using DDDNetCore.WorkBlocks.Mappers;
using DDDNetCore.WorkBlocks.Repository;
using DDDNetCore.WorkBlocks.Services;
using DDDSample1.Domain.Shared;
using Microsoft.AspNetCore.Mvc;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Xunit;

namespace XUnitTestMDV.DriverDutyTest.IntegrationTests
{
    public class RegisterDriverDutyTest
    {
        [Fact]
        public async void ShouldRegisterDriverDuty()
        {
            //Request simulation variables
            string inputId = "0123456789";
            string inputDriverId = "123456789";

            //Obtain the domain objects preentively
            DriverDuty domainObj = new DriverDuty(inputId, inputDriverId);
            DriverDutyDto inputObj = new DriverDutyDto(inputId, inputDriverId);

            //Mock dependencies
            var unitOfWork = new Mock<IUnitOfWork>();
            unitOfWork.Setup(o => o.CommitAsync())
                .Returns(Task.FromResult(200));

            WorkBlock w = null;
            var wbRepo = new Mock<IWorkBlockRepository>();
            wbRepo.Setup(o => o.GetByIdAsync(It.IsAny<WorkBlockCode>()))
               .Returns(Task.FromResult(w));


            var driverRepo = new Mock<IDriverRepository>();
            driverRepo.Setup(o => o.GetByIdAsync(It.IsAny<DriverMechanographicNumber>()))
               .Returns(Task.FromResult(new Driver("123456789", "name", "01/01/2000", "12345678", "01/01/2018", "01/01/2019", "123456789", "something", "license", "01/01/2019")));

            var mapper = new DriverDutyMapper();

            var driverDutyRepo = new Mock<IDriverDutyRepository>();
            driverDutyRepo.Setup(o => o.AddAsync(It.IsAny<DriverDuty>())).Returns(Task.FromResult(domainObj));

            var wbmapper = new WorkBlockMapper();
            AffectDriverDutyToWorkBlockService affectddService = new AffectDriverDutyToWorkBlockService(wbRepo.Object, wbmapper, unitOfWork.Object);
            //Run the test
            DriverDutyService serv = new DriverDutyService(unitOfWork.Object, affectddService, driverRepo.Object, driverDutyRepo.Object, mapper);

            RegisterDriverDutyController cntr = new RegisterDriverDutyController(serv);

            var result = await cntr.Register(inputObj);

            //Checks if the action was completed successfully
            Assert.IsType<OkObjectResult>(result.Result);

            OkObjectResult okRes = (OkObjectResult)result.Result;
            DriverDutyDto res = (DriverDutyDto)okRes.Value;

            //Chcks if the value of the task is correct
            Assert.Equal(inputObj.DriverDutyCode, res.DriverDutyCode);
            Assert.Equal(inputObj.DriverMecNumber, res.DriverMecNumber);
        }

        [Fact]
        public async void ShouldRegisterDriverDuty_ExceptionOcurred_TypeAlready_1()
        {
            //Request simulation variables
            string inputId = "0123456789";
            string inputDriverId = "123456789";

            //Obtain the domain objects preentively
            DriverDuty domainObj = new DriverDuty(inputId, inputDriverId);
            DriverDutyDto inputObj = new DriverDutyDto(inputId, inputDriverId);

            //Mock dependencies
            var unitOfWork = new Mock<IUnitOfWork>();
            unitOfWork.Setup(o => o.CommitAsync())
                .Returns(Task.FromResult(200));

            WorkBlock w = null;
            var wbRepo = new Mock<IWorkBlockRepository>();
            wbRepo.Setup(o => o.GetByIdAsync(It.IsAny<WorkBlockCode>()))
               .Returns(Task.FromResult(w));

            var wbmapper = new WorkBlockMapper();
            AffectDriverDutyToWorkBlockService affectddService = new AffectDriverDutyToWorkBlockService(wbRepo.Object, wbmapper, unitOfWork.Object);

            var driverRepo = new Mock<IDriverRepository>();
            driverRepo.Setup(o => o.GetByIdAsync(It.IsAny<DriverMechanographicNumber>()))
               .Returns(Task.FromResult(new Driver("123456789", "name", "01/01/2000", "12345678", "01/01/2018", "01/01/2019", "123456789", "something", "license", "01/01/2019")));

            var mapper = new DriverDutyMapper();

            var driverDutyRepo = new Mock<IDriverDutyRepository>();
            driverDutyRepo.Setup(o => o.AddAsync(It.IsAny<DriverDuty>())).Throws(new Exception("duplicate exists",new Exception("duplicate exists")));


            //Run the test
            DriverDutyService serv = new DriverDutyService(unitOfWork.Object, affectddService, driverRepo.Object, driverDutyRepo.Object, mapper);

            RegisterDriverDutyController cntr = new RegisterDriverDutyController(serv);

            var result = await cntr.Register(inputObj);

            //Checks if the action threw an error
            Assert.IsType<ContentResult>(result.Result);

            ContentResult res = (ContentResult)result.Result;

            //Chcks if the value of the task is correct
            Assert.Equal("duplicate exists", res.Content);
            Assert.Equal("Json", res.ContentType);
            Assert.Equal(422, res.StatusCode);
        }

        [Fact]
        public async void ShouldRegisterDriverDuty_ExceptionOcurred_TypeOther_1()
        {
            //Request simulation variables
            string inputId = "0123456";
            string inputDriverId = "123456789";

            //Obtain the domain objects preentively
            DriverDutyDto inputObj = new DriverDutyDto(inputId, inputDriverId);

            //Mock dependencies
            var unitOfWork = new Mock<IUnitOfWork>();
            unitOfWork.Setup(o => o.CommitAsync())
                .Returns(Task.FromResult(200));

            var driverRepo = new Mock<IDriverRepository>();
            driverRepo.Setup(o => o.GetByIdAsync(It.IsAny<DriverMechanographicNumber>()))
               .Returns(Task.FromResult(new Driver("123456789", "name", "01/01/2000", "12345678", "01/01/2018", "01/01/2019", "123456789", "something", "license", "01/01/2019")));

            WorkBlock w = null;
            var wbRepo = new Mock<IWorkBlockRepository>();
            wbRepo.Setup(o => o.GetByIdAsync(It.IsAny<WorkBlockCode>()))
               .Returns(Task.FromResult(w));

            var wbmapper = new WorkBlockMapper();
            AffectDriverDutyToWorkBlockService affectddService = new AffectDriverDutyToWorkBlockService(wbRepo.Object, wbmapper, unitOfWork.Object);

            var mapper = new DriverDutyMapper();

            var driverDutyRepo = new Mock<IDriverDutyRepository>();

            //Run the test
            DriverDutyService serv = new DriverDutyService(unitOfWork.Object, affectddService, driverRepo.Object, driverDutyRepo.Object, mapper);

            RegisterDriverDutyController cntr = new RegisterDriverDutyController(serv);

            var result = await cntr.Register(inputObj);

            //Checks if the action threw an error
            Assert.IsType<ContentResult>(result.Result);

            ContentResult res = (ContentResult)result.Result;

            //Chcks if the value of the task is correct
            Assert.Equal("DriverDutyCode must be 10 characters long", res.Content);
            Assert.Equal("Json", res.ContentType);
            Assert.Equal(400, res.StatusCode);
        }
    }
}
