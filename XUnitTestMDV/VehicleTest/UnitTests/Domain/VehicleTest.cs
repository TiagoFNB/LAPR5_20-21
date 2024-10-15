using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DDDNetCore.VehicleDuties.Domain;
using DDDNetCore.Vehicles.Domain;
using Xunit;

namespace XUnitTestMDV.VehicleTest.UnitTests.Domain
{
    public class VehicleTest
    {
        [Fact]
        public void ShouldCreateVehicleDuty_NormalSituation1()
        {
            DateTime d = new DateTime(2002, 10, 18);

            string vin = "12345678901234567";
            string license = "AA-01-AA";
            string type = "VehicleTypeTT";
            string date = "2015/12/25";
            

            Vehicle domainObj = new Vehicle(license,vin,type,date);

            Assert.Equal(license, domainObj.Id.Value);
            Assert.Equal(vin, domainObj.Vin.Vin);
            Assert.Equal(type, domainObj.Type.Type);
            Assert.Equal(date, domainObj.Date.EntryDateOfService);

        }

        [Fact]
        public void ShouldCreateVehicle_ExceptionOcurred_InvalidId_Null()
        {
            

            string vin = "12345678901234567";
            string license = null;
            string type = "VehicleTypeTT";
            string date = "2015/12/25";

            try
            {
                Vehicle domainObj = new Vehicle(license, vin, type, date);
            }
            catch (Exception e)
            {
                Assert.Equal("Object reference not set to an instance of an object.", e.Message);
            }
        }

        [Fact]
        public void ShouldCreateVehicle_ExceptionOcurred_InvalidId_InvalidFormat()
        {
            DateTime d = new DateTime(2002, 10, 18);

            string vin = "12345678901234567";
            string license = "AA-AA-AA";
            string type = "VehicleTypeTT";
            string date = "2015/12/25";

            try
            {
                Vehicle domainObj = new Vehicle(license, vin, type, date);
            }
            catch (Exception e)
            {
                Assert.Equal("Vehicle License Plate is in invalid format", e.Message);
            }
        }
        [Fact]
        public void ShouldCreateVehicle_ExceptionOcurred_InvalidType_NullOrEmpty()
        {


            string vin = "12345678901234567";
            string license = "AA-01-AA";
            string type = "";
            string date = "2015/12/25";

            try
            {
                Vehicle domainObj = new Vehicle(license, vin, type, date);
            }
            catch (Exception e)
            {
                Assert.Equal("VehicleType must be defined", e.Message);
            }
        }

        [Fact]
        public void ShouldCreateVehicle_ExceptionOcurred_InvalidVin_NullOrEmpty()
        {
            

            string vin = "";
            string license = "AA-01-AA";
            string type = "VehicleTypeTT";
            string date = "2015/12/25";

            try
            {
                Vehicle domainObj = new Vehicle(license, vin, type, date);
            }
            catch (Exception e)
            {
                Assert.Equal("VIN must be defined", e.Message);
            }
        }

        [Fact]
        public void ShouldCreateVehicle_ExceptionOcurred_InvalidVin_InvalidFormat()
        {
           

            string vin = "1";
            string license = "AA-01-AA";
            string type = "VehicleTypeTT";
            string date = "2015/12/25";

            try
            {
                Vehicle domainObj = new Vehicle(license, vin, type, date);
            }
            catch (Exception e)
            {
                Assert.Equal("VIN must be 17 characters long", e.Message);
            }
        }

        [Fact]
        public void ShouldCreateVehicle_ExceptionOcurred_InvalidDate_InvalidFormat()
        {
           

            string vin = "12345678901234567";
            string license = "AA-01-AA";
            string type = "VehicleTypeTT";
            string date = "2021/12/25";

            try
            {
                Vehicle domainObj = new Vehicle(license, vin, type, date);
            }
            catch (Exception e)
            {
                Assert.Equal("Invalid Date", e.Message);
            }
        }
        [Fact]
        public void ShouldCreateVehicle_ExceptionOcurred_InvalidDate_NullOrEmpty()
        {


            string vin = "12345678901234567";
            string license = "AA-01-AA";
            string type = "VehicleTypeTT";
            string date = "";

            try
            {
                Vehicle domainObj = new Vehicle(license, vin, type, date);
            }
            catch (Exception e)
            {
                Assert.Equal("EntryDateOfService must be defined", e.Message);
            }
        }
    }
}

