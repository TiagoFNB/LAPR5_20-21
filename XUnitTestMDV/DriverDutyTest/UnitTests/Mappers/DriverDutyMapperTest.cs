    using DDDNetCore.DriverDuties.Domain;
    using DDDNetCore.DriverDuties.Dto;
    using DDDNetCore.DriverDuties.Mappers;
    using Xunit;

namespace XUnitTestMDV.DriverDutyTest.UnitTests.Mappers
{
    public class DriverDutyMapperTest
    {
        [Fact]
        public void ShouldMapFromDomain2Dto_NormalSituation1()
        {
            //Request simulation variables
            string inputId = "0123456789";
            string inputDriverId = "123456789";

            //Obtain the domain objects preentively
            DriverDutyDto dtoObj = new DriverDutyDto(inputId, inputDriverId);
            DriverDuty domainObj = new DriverDuty(inputId, inputDriverId);

            //Run the mapper
            var mapper = new DriverDutyMapper();

            var result =mapper.MapFromDomain2Dto(domainObj);

            Assert.Equal(dtoObj.DriverDutyCode, result.DriverDutyCode);
            Assert.Equal(dtoObj.DriverMecNumber, result.DriverMecNumber);
        }

        [Fact]
        public void ShouldMapFromDriverDutyDtoToDomain_NormalSituation1()
        {
            //Request simulation variables
            string inputId = "0123456789";
            string inputDriverId = "123456789";

            //Obtain the domain objects preentively
            DriverDutyDto dtoObj = new DriverDutyDto(inputId, inputDriverId);
            DriverDuty domainObj = new DriverDuty(inputId, inputDriverId);

            //Run the mapper
            var mapper = new DriverDutyMapper();

            var result = mapper.MapFromDriverDutyDtoToDomain(dtoObj);

            Assert.Equal(domainObj.Id, result.Id);
            Assert.Equal(domainObj.DriverMecNumber, result.DriverMecNumber);
        }
    }
}