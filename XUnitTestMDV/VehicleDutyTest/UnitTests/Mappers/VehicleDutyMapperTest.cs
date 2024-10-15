using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DDDNetCore.VehicleDuties.Domain;
using DDDNetCore.VehicleDuties.Dto;
using DDDNetCore.VehicleDuties.Mappers;
using Xunit;

namespace XUnitTestMDV.VehicleDutyTest.UnitTests.Mappers
{
    public class VehicleDutyMapperTest{

    [Fact]
    public void ShouldMapFromDomain2Dto_NormalSituation1()
    {
            //Request simulation variables
            string inputId = "0123456789";
            string inputVehicleId = "AA-01-AA";

            //Obtain the domain objects preentively
            VehicleDutyDto dtoObj = new VehicleDutyDto(inputId, inputVehicleId);
            VehicleDuty domainObj = new VehicleDuty(inputId, inputVehicleId);

            //Run the mapper
            var mapper = new VehicleDutyMapper();

            var result = mapper.MapFromDomain2Dto(domainObj);

            Assert.Equal(dtoObj.VehicleDutyCode, result.VehicleDutyCode);
            Assert.Equal(dtoObj.VehicleLicense, result.VehicleLicense);
    }

    [Fact]
    public void ShouldMapFromVehicleDutyDtoToDomain_NormalSituation1()
    {
            //Request simulation variables
            string inputId = "0123456789";
            string inputVehicleId = "AA-01-AA";

            //Obtain the domain objects preentively
            VehicleDutyDto dtoObj = new VehicleDutyDto(inputId, inputVehicleId);
            VehicleDuty domainObj = new VehicleDuty(inputId, inputVehicleId);

             //Run the mapper
             var mapper = new VehicleDutyMapper();

            var result = mapper.MapFromVehicleDutyDtoToDomain(dtoObj);

            Assert.Equal(domainObj.Id, result.Id);
            Assert.Equal(domainObj.VehicleLicense, result.VehicleLicense);
    }
}
}