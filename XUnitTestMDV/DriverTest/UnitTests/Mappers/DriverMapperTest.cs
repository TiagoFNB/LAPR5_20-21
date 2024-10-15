using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DDDNetCore.Drivers.Domain;
using DDDNetCore.Drivers.Dto;
using DDDNetCore.Drivers.Mappers;
using DDDNetCore.Vehicles.Domain;
using DDDNetCore.Vehicles.Dto;
using DDDNetCore.Vehicles.Mappers;
using Xunit;

namespace XUnitTestMDV.DriverTest.UnitTests.Mappers
{
    public class DriverMapperTest
    {
        [Fact]
        public void ShouldMapFromDomain2Dto_NormalSituation1()
        {
            //Request simulation variables
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

            Driver domainObj = new Driver(MechanographicNumber, Name, BirthDate, CitizenCardNumber, EntryDate, DepartureDate, FiscalNumber, Type,License,LicenseDate);
            DriverDto dtoObj = new DriverDto(MechanographicNumber, Name, BirthDate, CitizenCardNumber, EntryDate, DepartureDate, FiscalNumber, Type,License,LicenseDate);

            

            //Run the mapper
            var mapper = new DriverMapper();

            var result = mapper.MapFromDomain2Dto(domainObj);

            Assert.Equal(dtoObj.MechanographicNumber, result.MechanographicNumber);
            Assert.Equal(dtoObj.Type, result.Type);
            Assert.Equal(dtoObj.CitizenCardNumber, result.CitizenCardNumber);
            Assert.Equal(dtoObj.Name, result.Name);
            Assert.Equal(dtoObj.FiscalNumber, result.FiscalNumber);
            Assert.Equal(dtoObj.BirthDate, result.BirthDate);
            Assert.Equal(dtoObj.DepartureDate, result.DepartureDate);
            Assert.Equal(dtoObj.EntryDate, result.EntryDate);
            Assert.Equal(dtoObj.License, domainObj.License.License);
            Assert.Equal(dtoObj.LicenseDate, domainObj.LicenseDate.LicenseDate);


        }

        [Fact]
        public void ShouldMapFromDriverDtoToDomain_NormalSituation1()
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


            Driver domainObj = new Driver(MechanographicNumber, Name, BirthDate, CitizenCardNumber, EntryDate, DepartureDate, FiscalNumber, Type,License,LicenseDate);
            DriverDto dtoObj = new DriverDto(MechanographicNumber, Name, BirthDate, CitizenCardNumber, EntryDate, DepartureDate, FiscalNumber, Type,License,LicenseDate);



            //Run the mapper
            var mapper = new DriverMapper();

            var result = mapper.MapFromDriverDtoToDomain(dtoObj);

            Assert.Equal(domainObj.Id.Value, result.Id.Value);
            Assert.Equal(domainObj.Name.Name, result.Name.Name);
            Assert.Equal(domainObj.BirthDate.BirthDate, result.BirthDate.BirthDate);
            Assert.Equal(domainObj.CitizenCardNumber.CitizenCardNumber, result.CitizenCardNumber.CitizenCardNumber);
            Assert.Equal(domainObj.EntryDate.EntryDate, result.EntryDate.EntryDate);
            Assert.Equal(domainObj.FiscalNumber.Nif, result.FiscalNumber.Nif);
            Assert.Equal(domainObj.Type.Type, result.Type.Type);
            Assert.Equal(domainObj.License.License, result.License.License);
            Assert.Equal(domainObj.LicenseDate.LicenseDate, result.LicenseDate.LicenseDate);
        }
    }
}
