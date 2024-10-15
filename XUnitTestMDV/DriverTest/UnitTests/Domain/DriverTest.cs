using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DDDNetCore.Drivers.Domain;
using Xunit;

namespace XUnitTestMDV.DriverTest.UnitTests.Domain
{
    public class DriverTest
    {
        [Fact]
        public void ShouldCreateDriver_NormalSituation1()
        {
            string MechanographicNumber = "123456789";
            string Name="jajaja1";
            string BirthDate = "2000/06/28";
            string CitizenCardNumber="12345678";
            string EntryDate="2020/11/20";
            string DepartureDate = "2020/11/21";
            string FiscalNumber="123456789";
            string Type="PandaKungFu";
            string License = "P-564681651 A";
            string LicenseDate = "2020/11/20";





            Driver domainObj = new Driver(MechanographicNumber,Name,BirthDate,CitizenCardNumber,EntryDate,DepartureDate,FiscalNumber,Type, License, LicenseDate);

            Assert.Equal(MechanographicNumber, domainObj.Id.Value);
            Assert.Equal(Name, domainObj.Name.Name);
            Assert.Equal(BirthDate, domainObj.BirthDate.BirthDate);
            Assert.Equal(CitizenCardNumber, domainObj.CitizenCardNumber.CitizenCardNumber);
            Assert.Equal(EntryDate,domainObj.EntryDate.EntryDate);
            Assert.Equal(FiscalNumber,domainObj.FiscalNumber.Nif);
            Assert.Equal(Type,domainObj.Type.Type);
            Assert.Equal(License,domainObj.License.License);
            Assert.Equal(LicenseDate, domainObj.LicenseDate.LicenseDate);

        }

        [Fact]
        public void ShouldCreateDriver_ExceptionOcurred_InvalidId_Null()
        {

            string MechanographicNumber = null;
            string Name = "jajaja1";
            string BirthDate = "2000/06/28";
            string CitizenCardNumber = "12345678";
            string EntryDate = "2020/11/20";
            string DepartureDate = "2020/11/21";
            string FiscalNumber = "123456789";
            string Type = "PandaKungFu";
            string License = "P-564681651 A";
            string LicenseDate = "2020/11/20";


            try
            {
                Driver domainObj = new Driver(MechanographicNumber, Name, BirthDate, CitizenCardNumber, EntryDate, DepartureDate, FiscalNumber, Type, License, LicenseDate);
            }
            catch (Exception e)
            {
                Assert.Equal("Object reference not set to an instance of an object.", e.Message);
            }
        }

        [Fact]
        public void ShouldCreateDriver_ExceptionOcurred_InvalidId_InvalidFormat()
        {

            string MechanographicNumber = "123456_89";
            string Name = "jajaja1";
            string BirthDate = "2000/06/28";
            string CitizenCardNumber = "12345678";
            string EntryDate = "2020/11/20";
            string DepartureDate = "2020/11/21";
            string FiscalNumber = "123456789";
            string Type = "PandaKungFu";
            string License = "P-564681651 A";
            string LicenseDate = "2020/11/20";
            try
            {
                Driver domainObj = new Driver(MechanographicNumber, Name, BirthDate, CitizenCardNumber, EntryDate, DepartureDate, FiscalNumber, Type, License, LicenseDate);
            }
            catch (Exception e)
            {
                Assert.Equal("DriverMechanographicNumber must be alphanumeric", e.Message);
            }
        }
        [Fact]
        public void ShouldCreateDriver_ExceptionOcurred_InvalidId_InvalidFormat2()
        {

            string MechanographicNumber = "1234567890";
            string Name = "jajaja1";
            string BirthDate = "2000/06/28";
            string CitizenCardNumber = "12345678";
            string EntryDate = "2020/11/20";
            string DepartureDate = "2020/11/21";
            string FiscalNumber = "123456789";
            string Type = "PandaKungFu";
            string License = "P-564681651 A";
            string LicenseDate = "2020/11/20";
            try
            {
                Driver domainObj = new Driver(MechanographicNumber, Name, BirthDate, CitizenCardNumber, EntryDate, DepartureDate, FiscalNumber, Type, License, LicenseDate);
            }
            catch (Exception e)
            {
                Assert.Equal("DriverMechanographicNumber must be 9 characters long", e.Message);
            }
        }
        [Fact]
        public void ShouldCreateDriver_ExceptionOcurred_InvalidType_NullOrEmpty()
        {


            string MechanographicNumber = "123456789";
            string Name = "jajaja1";
            string BirthDate = "2000/06/28";
            string CitizenCardNumber = "12345678";
            string EntryDate = "2020/11/20";
            string DepartureDate = "2020/11/21";
            string FiscalNumber = "123456789";
            string Type = null;
            string License = "P-564681651 A";
            string LicenseDate = "2020/11/20";

            try
            {
                Driver domainObj = new Driver(MechanographicNumber, Name, BirthDate, CitizenCardNumber, EntryDate, DepartureDate, FiscalNumber, Type, License, LicenseDate);
            }
            catch (Exception e)
            {
                Assert.Equal("DriverType must be defined", e.Message);
            }
        }

        [Fact]
        public void ShouldCreateDriver_ExceptionOcurred_InvalidName_NullOrEmpty()
        {


            string MechanographicNumber = "123456789";
            string Name = "";
            string BirthDate = "2000/06/28";
            string CitizenCardNumber = "12345678";
            string EntryDate = "2020/11/20";
            string DepartureDate = "2020/11/21";
            string FiscalNumber = "123456789";
            string Type = "PandaKungFu";
            string License = "P-564681651 A";
            string LicenseDate = "2020/11/20";

            try
            {
                Driver domainObj = new Driver(MechanographicNumber, Name, BirthDate, CitizenCardNumber, EntryDate, DepartureDate, FiscalNumber, Type, License, LicenseDate);
            }
            catch (Exception e)
            {
                Assert.Equal("Driver Name must be defined", e.Message);
            }
        }

        [Fact]
        public void ShouldCreateDriver_ExceptionOcurred_InvalidCitizenCardNumber_InvalidFormat()
        {


            string MechanographicNumber = "123456789";
            string Name = "jajaja1";
            string BirthDate = "2000/06/28";
            string CitizenCardNumber = "1234567";
            string EntryDate = "2020/11/20";
            string DepartureDate = "2020/11/21";
            string FiscalNumber = "123456789";
            string Type = "PandaKungFu";
            string License = "P-564681651 A";
            string LicenseDate = "2020/11/20";

            try
            {
                Driver domainObj = new Driver(MechanographicNumber, Name, BirthDate, CitizenCardNumber, EntryDate, DepartureDate, FiscalNumber, Type, License, LicenseDate);
            }
            catch (Exception e)
            {
                Assert.Equal("CitizenCardNumber must be 8 characters long", e.Message);
            }
        }

        [Fact]
        public void ShouldCreateDriver_ExceptionOcurred_InvalidCitizenCardNumber_NullOrEmpty()
        {


            string MechanographicNumber = "123456789";
            string Name = "jajaja1";
            string BirthDate = "2000/06/28";
            string CitizenCardNumber = "";
            string EntryDate = "2020/11/20";
            string DepartureDate = "2020/11/21";
            string FiscalNumber = "123456789";
            string Type = "PandaKungFu";
            string License = "P-564681651 A";
            string LicenseDate = "2020/11/20";

            try
            {
                Driver domainObj = new Driver(MechanographicNumber, Name, BirthDate, CitizenCardNumber, EntryDate, DepartureDate, FiscalNumber, Type, License, LicenseDate);
            }
            catch (Exception e)
            {
                Assert.Equal("CitizenCardNumber must be defined", e.Message);
            }
        }

        [Fact]
        public void ShouldCreateDriver_ExceptionOcurred_InvalidEntryDate_InvalidFormat()
        {


            string MechanographicNumber = "123456789";
            string Name = "jajaja1";
            string BirthDate = "2000/06/28";
            string CitizenCardNumber = "12345678";
            string EntryDate = "2099/1/20";
            string DepartureDate = "2020/11/21";
            string FiscalNumber = "123456789";
            string Type = "PandaKungFu";
            string License = "P-564681651 A";
            string LicenseDate = "2020/11/20";

            try
            {
                Driver domainObj = new Driver(MechanographicNumber, Name, BirthDate, CitizenCardNumber, EntryDate, DepartureDate, FiscalNumber, Type, License, LicenseDate);
            }
            catch (Exception e)
            {
                Assert.Equal("Invalid Date", e.Message);
            }
        }
        [Fact]
        public void ShouldCreateDriver_ExceptionOcurred_InvalidEntryDate_NullOrEmpty()
        {


            string MechanographicNumber = "123456789";
            string Name = "jajaja1";
            string BirthDate = "2000/06/28";
            string CitizenCardNumber = "12345678";
            string EntryDate = "";
            string DepartureDate = "2020/11/21";
            string FiscalNumber = "123456789";
            string Type = "PandaKungFu";
            string License = "P-564681651 A";
            string LicenseDate = "2020/11/20";

            try
            {
                Driver domainObj = new Driver(MechanographicNumber, Name, BirthDate, CitizenCardNumber, EntryDate, DepartureDate, FiscalNumber, Type, License, LicenseDate);
            }
            catch (Exception e)
            {
                Assert.Equal("EntryDate must be defined", e.Message);
            }
        }

        [Fact]
        public void ShouldCreateDriver_ExceptionOcurred_InvalidBirthDate_InvalidFormat()
        {


            string MechanographicNumber = "123456789";
            string Name = "jajaja1";
            string BirthDate = "2010/06/28";
            string CitizenCardNumber = "12345678";
            string EntryDate = "2020/1/20";
            string DepartureDate = "2020/11/21";
            string FiscalNumber = "123456789";
            string Type = "PandaKungFu";
            string License = "P-564681651 A";
            string LicenseDate = "2020/11/20";

            try
            {
                Driver domainObj = new Driver(MechanographicNumber, Name, BirthDate, CitizenCardNumber, EntryDate, DepartureDate, FiscalNumber, Type, License, LicenseDate);
            }
            catch (Exception e)
            {
                Assert.Equal("Invalid BirthDate", e.Message);
            }
        }
        [Fact]
        public void ShouldCreateDriver_ExceptionOcurred_InvalidBirthDate_NullOrEmpty()
        {


            string MechanographicNumber = "123456789";
            string Name = "jajaja1";
            string BirthDate = "";
            string CitizenCardNumber = "12345678";
            string EntryDate = "2020/11/20";
            string DepartureDate = "2020/11/21";
            string FiscalNumber = "123456789";
            string Type = "PandaKungFu";
            string License = "P-564681651 A";
            string LicenseDate = "2020/11/20";

            try
            {
                Driver domainObj = new Driver(MechanographicNumber, Name, BirthDate, CitizenCardNumber, EntryDate, DepartureDate, FiscalNumber, Type, License, LicenseDate);
            }
            catch (Exception e)
            {
                Assert.Equal("BirthDate must be defined", e.Message);
            }
        }

        [Fact]
        public void ShouldCreateDriver_ExceptionOcurred_InvalidLicense_NullOrEmpty()
        {


            string MechanographicNumber = "123456789";
            string Name = "jajaja1";
            string BirthDate = "2000/11/20";
            string CitizenCardNumber = "12345678";
            string EntryDate = "2020/11/20";
            string DepartureDate = "2020/11/21";
            string FiscalNumber = "123456789";
            string Type = "PandaKungFu";
            string License = "";
            string LicenseDate = "2020/11/20";

            try
            {
                Driver domainObj = new Driver(MechanographicNumber, Name, BirthDate, CitizenCardNumber, EntryDate, DepartureDate, FiscalNumber, Type, License, LicenseDate);
            }
            catch (Exception e)
            {
                Assert.Equal("DriverLicense must be defined", e.Message);
            }
        }

        [Fact]
        public void ShouldCreateDriver_ExceptionOcurred_InvalidLicenseDate_NullOrEmpty()
        {


            string MechanographicNumber = "123456789";
            string Name = "jajaja1";
            string BirthDate = "2000/11/20";
            string CitizenCardNumber = "12345678";
            string EntryDate = "2020/11/20";
            string DepartureDate = "2020/11/21";
            string FiscalNumber = "123456789";
            string Type = "PandaKungFu";
            string License = "P-564681651 A";
            string LicenseDate = "";

            try
            {
                Driver domainObj = new Driver(MechanographicNumber, Name, BirthDate, CitizenCardNumber, EntryDate, DepartureDate, FiscalNumber, Type, License, LicenseDate);
            }
            catch (Exception e)
            {
                Assert.Equal("DriverLicenseDate must be defined", e.Message);
            }
        }
    }
}
