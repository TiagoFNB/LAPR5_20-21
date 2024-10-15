using DDDNetCore.DriverDuties.Domain;
using DDDNetCore.DriverDuties.Dto;
using DDDNetCore.DriverDuties.Mappers;
using DDDNetCore.DriverDuties.Repository;
using DDDNetCore.DriverDuties.Services;
using DDDNetCore.Drivers.Domain;
using DDDNetCore.Drivers.Domain.ValueObjects;
using DDDNetCore.Drivers.Repository;
using DDDNetCore.WorkBlocks.Dto;
using DDDNetCore.WorkBlocks.Services;
using DDDSample1.Domain.Shared;
using Moq;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;

namespace XUnitTestMDV.DriverDutyTest.UnitTests.Services
{
    public class DriverDutyServiceTest
    {
        [Fact]
        public async void ShouldRegisterDriverDuty_NormalSituation1()
        {
            //Request simulation variables
            string inputId = "0123456789";
            string inputDriverId = "123456789";

            //Obtain the domain objects preentively
            DriverDuty domainObj= new DriverDuty(inputId, inputDriverId);
            DriverDutyDto inputObj = new DriverDutyDto(inputId, inputDriverId);

            //Mock dependencies
            var unitOfWork = new Mock<IUnitOfWork>();
            unitOfWork.Setup(o => o.CommitAsync())
                .Returns(Task.FromResult(200));

            List<ReplyWorkBlockDto> ln = new List<ReplyWorkBlockDto>();
            var affectedWbService = new Mock<IAffectDriverDutyToWorkBlockService>();
            affectedWbService.Setup(o => o.AffectDriverDuty(It.IsAny<DriverDutyPlannedResponseDto>()))
                .Returns(Task.FromResult(ln));

            

            var driverRepo = new Mock<IDriverRepository>();
            driverRepo.Setup(o => o.GetByIdAsync(new DriverMechanographicNumber(inputDriverId)))
               .Returns(Task.FromResult(new Driver("123456789","name","01/01/2000","12345678","01/01/2018","01/01/2019","123456789","something", "license", "01/01/2019")));

            var mapper = new Mock<IDriverDutyMapper>();
            mapper.Setup(o => o.MapFromDriverDutyDtoToDomain(inputObj))
               .Returns(domainObj);
            mapper.Setup(o => o.MapFromDomain2Dto(domainObj))
               .Returns(inputObj);

            var driverDutyRepo = new Mock<IDriverDutyRepository>();
            driverDutyRepo.Setup(o => o.AddAsync(domainObj))
               .Returns(Task.FromResult(domainObj));


            //Run the service
            var serv = new DriverDutyService(unitOfWork.Object, affectedWbService.Object, driverRepo.Object, driverDutyRepo.Object,mapper.Object);

            var result = await serv.AddAsync(inputObj);

            Assert.Equal(inputObj.DriverDutyCode, result.DriverDutyCode);
            Assert.Equal(inputObj.DriverMecNumber, result.DriverMecNumber);
        }

        [Fact]
        public async void ShouldRegisterDriverDuty_ExceptionOcurred_DriverDoesNotExist_1()
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

            List<ReplyWorkBlockDto> ln = new List<ReplyWorkBlockDto>();
            var affectedWbService = new Mock<IAffectDriverDutyToWorkBlockService>();
            affectedWbService.Setup(o => o.AffectDriverDuty(It.IsAny<DriverDutyPlannedResponseDto>()))
                .Returns(Task.FromResult(ln));

            Driver driver = null;

            var driverRepo = new Mock<IDriverRepository>();
            driverRepo.Setup(o => o.GetByIdAsync(new DriverMechanographicNumber(inputDriverId)))
               .Returns(Task.FromResult(driver));

            var mapper = new Mock<IDriverDutyMapper>();
            mapper.Setup(o => o.MapFromDriverDutyDtoToDomain(inputObj))
               .Returns(domainObj);
            mapper.Setup(o => o.MapFromDomain2Dto(domainObj))
               .Returns(inputObj);

            var driverDutyRepo = new Mock<IDriverDutyRepository>();
            driverDutyRepo.Setup(o => o.AddAsync(domainObj))
               .Returns(Task.FromResult(domainObj));


            //Run the service
            var serv = new DriverDutyService(unitOfWork.Object, affectedWbService.Object, driverRepo.Object, driverDutyRepo.Object, mapper.Object);

            var expresult = new Exception("That driver does not exist !");

            try
            {
                var result = await serv.AddAsync(inputObj);
                Assert.True(false);
            }catch(Exception e)
            {
                Assert.Equal(e.Message,expresult.Message);
            }
           
        }


        [Fact]
        public async void ShouldRegisterDriverDuty_ExceptionOcurred_LocalValidationFail_1()
        {
            //Request simulation variables
            string inputId = "0123456789";
            string inputDriverId = "123456789";

            //Obtain the domain objects preentively
            DriverDuty domainObj = new DriverDuty(inputId, inputDriverId);
            DriverDutyDto inputObj = new DriverDutyDto(inputId, inputDriverId);

            Exception error = new Exception("Local validation failed.");

            //Mock dependencies
            var unitOfWork = new Mock<IUnitOfWork>();
            unitOfWork.Setup(o => o.CommitAsync())
                .Returns(Task.FromResult(200));

            List<ReplyWorkBlockDto> ln = new List<ReplyWorkBlockDto>();
            var affectedWbService = new Mock<IAffectDriverDutyToWorkBlockService>();
            affectedWbService.Setup(o => o.AffectDriverDuty(It.IsAny<DriverDutyPlannedResponseDto>()))
                .Returns(Task.FromResult(ln));

            var driverRepo = new Mock<IDriverRepository>();
            driverRepo.Setup(o => o.GetByIdAsync(new DriverMechanographicNumber(inputDriverId)))
               .Returns(Task.FromResult(new Driver("123456789", "name", "01/01/2000", "12345678", "01/01/2018", "01/01/2019", "123456789", "something", "license", "01/01/2019")));

            var mapper = new Mock<IDriverDutyMapper>();
            mapper.Setup(o => o.MapFromDriverDutyDtoToDomain(inputObj))
               .Throws(error);
            mapper.Setup(o => o.MapFromDomain2Dto(domainObj))
               .Returns(inputObj);

            var driverDutyRepo = new Mock<IDriverDutyRepository>();
            driverDutyRepo.Setup(o => o.AddAsync(domainObj))
               .Returns(Task.FromResult(domainObj));


            //Run the service
            var serv = new DriverDutyService(unitOfWork.Object, affectedWbService.Object, driverRepo.Object, driverDutyRepo.Object, mapper.Object);

            var expresult = error;

            try
            {
                var result = await serv.AddAsync(inputObj);
                Assert.True(false);
            }
            catch (Exception e)
            {
                Assert.Same(expresult, e);
            }

        }

    }
}
