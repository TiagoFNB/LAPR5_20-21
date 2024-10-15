using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DDDNetCore.DriverDuties.Dto;
using DDDNetCore.VehicleDuties.Controllers;
using DDDNetCore.VehicleDuties.Domain;
using DDDNetCore.VehicleDuties.Dto;
using DDDNetCore.VehicleDuties.Mappers;
using DDDNetCore.VehicleDuties.Repository;
using DDDNetCore.VehicleDuties.Services;
using DDDNetCore.Vehicles.Domain;
using DDDNetCore.Vehicles.Repository;
using DDDNetCore.Vehicles.ValueObjects;
using DDDSample1.Domain.Shared;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;

namespace XUnitTestMDV.VehicleDutyTest.IntegrationTests
{
    public class RegisterVehicleDutyTest
    {
        [Fact]
        public async void ShouldRegisterVehicleDuty()
        {
            //Request simulation variables
            string inputId = "0123456789";
            string inputVehicleId = "AA-01-AA";

            //Obtain the domain objects preentively
            VehicleDuty domainObj = new VehicleDuty(inputId, inputVehicleId);
            VehicleDutyDto inputObj = new VehicleDutyDto(inputId, inputVehicleId);

            //Mock dependencies
            var unitOfWork = new Mock<IUnitOfWork>();
            unitOfWork.Setup(o => o.CommitAsync())
                .Returns(Task.FromResult(200));

            var vehicleRepo = new Mock<IVehicleRepository>();
            vehicleRepo.Setup(o => o.GetByIdAsync(It.IsAny<VehicleLicense>()))
                .Returns(Task.FromResult(new Vehicle("AA-01-AA", "12345678901234567", "something", "01/01/2018")));

            var mapper = new VehicleDutyMapper();

            var vehicleDutyRepo = new Mock<IVehicleDutyRepository>();
            vehicleDutyRepo.Setup(o => o.AddAsync(It.IsAny<VehicleDuty>()))
                .Returns(Task.FromResult(domainObj));

            //Run the test
            VehicleDutyService serv = new VehicleDutyService(unitOfWork.Object, vehicleRepo.Object, vehicleDutyRepo.Object, mapper);

            RegisterVehicleDutyController cntr = new RegisterVehicleDutyController(serv);

            var result = await cntr.Register(inputObj);

            Assert.IsType<OkObjectResult>(result.Result);

            OkObjectResult okRes = (OkObjectResult)result.Result;
            VehicleDutyDto res = (VehicleDutyDto)okRes.Value;

            //Chcks if the value of the task is correct
            Assert.Equal(inputObj.VehicleDutyCode, res.VehicleDutyCode);
            Assert.Equal(inputObj.VehicleLicense, res.VehicleLicense);
        }

        [Fact]
        public async void ShouldRegisterVehicleDuty_ExceptionOcurred_TypeAlready_1()
        {
            //Request simulation variables
            string inputId = "0123456789";
            string inputVehicleId = "AA-01-AA";

            //Obtain the domain objects preentively
            VehicleDuty domainObj = new VehicleDuty(inputId, inputVehicleId);
            VehicleDutyDto inputObj = new VehicleDutyDto(inputId, inputVehicleId);

            //Mock dependencies
            var unitOfWork = new Mock<IUnitOfWork>();
            unitOfWork.Setup(o => o.CommitAsync())
                .Returns(Task.FromResult(200));

            var vehicleRepo = new Mock<IVehicleRepository>();
            vehicleRepo.Setup(o => o.GetByIdAsync(It.IsAny<VehicleLicense>()))
                .Returns(Task.FromResult(new Vehicle("AA-01-AA", "12345678901234567", "something", "01/01/2018")));

            var mapper = new VehicleDutyMapper();

            var vehicleDutyRepo = new Mock<IVehicleDutyRepository>();
            vehicleDutyRepo.Setup(o => o.AddAsync(It.IsAny<VehicleDuty>()))
                .Throws(new Exception("duplicate error", new Exception("duplicate exists")));

            //Run the test
            VehicleDutyService serv = new VehicleDutyService(unitOfWork.Object, vehicleRepo.Object, vehicleDutyRepo.Object, mapper);

            RegisterVehicleDutyController cntr = new RegisterVehicleDutyController(serv);
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
        public async void ShouldRegisterVehicleDuty_ExceptionOcurred_TypeOther_1()
        {
            //Request simulation variables
            //Request simulation variables
            string inputId = "123456789";
            string inputVehicleId = "AA-01-AA";

            //Obtain the domain objects preentively
            
            VehicleDutyDto inputObj = new VehicleDutyDto(inputId, inputVehicleId);

            //Mock dependencies
            var unitOfWork = new Mock<IUnitOfWork>();
            unitOfWork.Setup(o => o.CommitAsync())
                .Returns(Task.FromResult(200));

            var vehicleRepo = new Mock<IVehicleRepository>();
            vehicleRepo.Setup(o => o.GetByIdAsync(It.IsAny<VehicleLicense>()))
               .Returns(Task.FromResult(new Vehicle("AA-01-AA", "12345678901234567", "something", "01/01/2018")));

            var mapper = new VehicleDutyMapper();

            var vehicleDutyRepo = new Mock<IVehicleDutyRepository>();

            //Run the test
            VehicleDutyService serv = new VehicleDutyService(unitOfWork.Object, vehicleRepo.Object, vehicleDutyRepo.Object, mapper);

            RegisterVehicleDutyController cntr = new RegisterVehicleDutyController(serv);
            var result = await cntr.Register(inputObj);

            //Checks if the action threw an error
            Assert.IsType<ContentResult>(result.Result);

            ContentResult res = (ContentResult)result.Result;

            //Chcks if the value of the task is correct
            Assert.Equal("VehicleDutyCode must be 10 characters long", res.Content);
            Assert.Equal("Json", res.ContentType);
            Assert.Equal(400, res.StatusCode);
        }
    }
}

