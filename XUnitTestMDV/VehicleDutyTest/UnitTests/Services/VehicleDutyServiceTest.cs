using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DDDNetCore.VehicleDuties.Domain;
using DDDNetCore.VehicleDuties.Dto;
using DDDNetCore.VehicleDuties.Mappers;
using DDDNetCore.VehicleDuties.Repository;
using DDDNetCore.VehicleDuties.Services;
using DDDNetCore.Vehicles.Domain;
using DDDNetCore.Vehicles.Repository;
using DDDNetCore.Vehicles.ValueObjects;
using DDDSample1.Domain.Shared;
using Moq;
using Xunit;

namespace XUnitTestMDV.VehicleDutyTest.UnitTests.Services
{
    public class VehicleDutyServiceTest
    {
        [Fact]
        public async void ShouldRegisterVehicleDuty_NormalSituation1()
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
            vehicleRepo.Setup(o => o.GetByIdAsync(new VehicleLicense(inputVehicleId)))
               .Returns(Task.FromResult(new Vehicle("AA-01-AA", "12345678901234567", "something",  "01/01/2018")));

            var mapper = new Mock<IVehicleDutyMapper>();
            mapper.Setup(o => o.MapFromVehicleDutyDtoToDomain(inputObj))
               .Returns(domainObj);
            mapper.Setup(o => o.MapFromDomain2Dto(domainObj))
               .Returns(inputObj);

            var vehicleDutyRepo = new Mock<IVehicleDutyRepository>();
            vehicleDutyRepo.Setup(o => o.AddAsync(domainObj))
               .Returns(Task.FromResult(domainObj));


            //Run the service
            var serv = new VehicleDutyService(unitOfWork.Object, vehicleRepo.Object, vehicleDutyRepo.Object, mapper.Object);

            var result = await serv.AddAsync(inputObj);

            Assert.Equal(inputObj.VehicleDutyCode, result.VehicleDutyCode);
            Assert.Equal(inputObj.VehicleLicense, result.VehicleLicense);
        }

        [Fact]
        public async void ShouldRegisterVehicleDuty_ExceptionOcurred_VehicleDoesNotExist_1()
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

            Vehicle v = null;

            var vehicleRepo = new Mock<IVehicleRepository>();
            vehicleRepo.Setup(o => o.GetByIdAsync(new VehicleLicense(inputVehicleId)))
                .Returns(Task.FromResult(v));

            var mapper = new Mock<IVehicleDutyMapper>();
            mapper.Setup(o => o.MapFromVehicleDutyDtoToDomain(inputObj))
                .Returns(domainObj);
            mapper.Setup(o => o.MapFromDomain2Dto(domainObj))
                .Returns(inputObj);

            var vehicleDutyRepo = new Mock<IVehicleDutyRepository>();
            vehicleDutyRepo.Setup(o => o.AddAsync(domainObj))
                .Returns(Task.FromResult(domainObj));


            //Run the service
            var serv = new VehicleDutyService(unitOfWork.Object, vehicleRepo.Object, vehicleDutyRepo.Object, mapper.Object);

            var expresult = new Exception("That vehicle does not exist !");

            try
            {
                var result = await serv.AddAsync(inputObj);
                Assert.True(false);
            }
            catch (Exception e)
            {
                Assert.Equal(e.Message, expresult.Message);
            }

        }


        [Fact]
        public async void ShouldRegisterVehicleDuty_ExceptionOcurred_LocalValidationFail_1()
        {
            //Request simulation variables
            string inputId = "0123456789";
            string inputVehicleId = "AA-01-AA";

            //Obtain the domain objects preentively
            VehicleDuty domainObj = new VehicleDuty(inputId, inputVehicleId);
            VehicleDutyDto inputObj = new VehicleDutyDto(inputId, inputVehicleId);

            Exception error = new Exception("Local validation failed.");

            //Mock dependencies
            var unitOfWork = new Mock<IUnitOfWork>();
            unitOfWork.Setup(o => o.CommitAsync())
                .Returns(Task.FromResult(200));

            var vehicleRepo = new Mock<IVehicleRepository>();
            vehicleRepo.Setup(o => o.GetByIdAsync(new VehicleLicense(inputVehicleId)))
                .Returns(Task.FromResult(new Vehicle("AA-01-AA", "12345678901234567", "something", "01/01/2018")));

            var mapper = new Mock<IVehicleDutyMapper>();
            mapper.Setup(o => o.MapFromVehicleDutyDtoToDomain(inputObj))
                .Throws(error);
            mapper.Setup(o => o.MapFromDomain2Dto(domainObj))
                .Returns(inputObj);

            var vehicleDutyRepo = new Mock<IVehicleDutyRepository>();
            vehicleDutyRepo.Setup(o => o.AddAsync(domainObj))
                .Returns(Task.FromResult(domainObj));


            //Run the service
            var serv = new VehicleDutyService(unitOfWork.Object, vehicleRepo.Object, vehicleDutyRepo.Object, mapper.Object);

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
