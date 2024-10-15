using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DDDNetCore.VehicleDuties.Mappers;
using DDDNetCore.Vehicles.Domain;
using DDDNetCore.Vehicles.Dto;
using DDDNetCore.Vehicles.Mappers;
using Xunit;

namespace XUnitTestMDV.VehicleTest.UnitTests.Mappers
{
    public class VehicleMapperTest
    
    {
    [Fact]
    public void ShouldMapFromDomain2Dto_NormalSituation1()
    {
        //Request simulation variables
        string vin = "12345678901234567";
        string license = "AA-01-AA";
        string type = "VehicleTypeTT";
        string date = "2015/12/25";

            //Obtain the domain objects preentively
            VehicleDto dtoObj = new VehicleDto(license, vin, type, date);
            Vehicle domainObj = new Vehicle(license, vin, type, date);

        //Run the mapper
        var mapper = new VehicleMapper();

        var result = mapper.MapFromDomain2Dto(domainObj);

        Assert.Equal(dtoObj.License, result.License);
        Assert.Equal(dtoObj.Date, result.Date);
        Assert.Equal(dtoObj.Vin, result.Vin);
        Assert.Equal(dtoObj.Date, result.Date);
        }

    [Fact]
    public void ShouldMapFromVehicleDtoToDomain_NormalSituation1()
    {
            //Request simulation variables
            string vin = "12345678901234567";
            string license = "AA-01-AA";
            string type = "VehicleTypeTT";
            string date = "2015/12/25";

            //Obtain the domain objects preentively
            VehicleDto dtoObj = new VehicleDto(license,vin,type,date);
            Vehicle domainObj = new Vehicle(license, vin, type, date);

        //Run the mapper
        var mapper = new VehicleMapper();

        var result = mapper.MapFromVehicleDtoToDomain(dtoObj);

        Assert.Equal(domainObj.Id, result.Id);
        Assert.Equal(domainObj.Vin.Vin, result.Vin.Vin);
        Assert.Equal(domainObj.Date.EntryDateOfService, result.Date.EntryDateOfService);
        Assert.Equal(domainObj.Type.Type, result.Type.Type);
        }
}
}
