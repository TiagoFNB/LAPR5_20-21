using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DDDNetCore.VehicleDuties.Domain;
using Xunit;

namespace XUnitTestMDV.VehicleDutyTest.UnitTests.Domain
{
    public class VehicleDutyTest
    {
        [Fact]
        public void ShouldCreateVehicleDuty_NormalSituation1()
        {
            DateTime d = new DateTime(2002, 10, 18);

            string id = "0123456789";
            string vehicleId = "AA-01-AA";

            VehicleDuty domainObj = new VehicleDuty(id, vehicleId);

            Assert.Equal(id, domainObj.Id.Value);
            Assert.Equal(vehicleId, domainObj.VehicleLicense.Value);
        }

        [Fact]
        public void ShouldCreateVehicleDuty_ExceptionOcurred_InvalidId_Null()
        {
            DateTime d = new DateTime(2002, 10, 18);

            string id = null;
            string vehicleId = "AA-01-AA";

            try
            {
                VehicleDuty domainObj = new VehicleDuty(id, vehicleId);
            }
            catch (Exception e)
            {
                Assert.Equal("Object reference not set to an instance of an object.", e.Message);
            }
        }

        [Fact]
        public void ShouldCreateVehicleDuty_ExceptionOcurred_InvalidId_NotAlphanumeric()
        {
            DateTime d = new DateTime(2002, 10, 18);

            string id = "abc-d";
            string vehicleId = "AA-01-AA";

            try
            {
                VehicleDuty domainObj = new VehicleDuty(id, vehicleId);
            }
            catch (Exception e)
            {
                Assert.Equal("VehicleDutyCode must be alphanumeric", e.Message);
            }
        }

        [Fact]
        public void ShouldCreateVehicleDuty_ExceptionOcurred_InvalidId_Not10CharLong()
        {
            DateTime d = new DateTime(2002, 10, 18);

            string id = "abcd";
            string vehicleId = "AA-01-AA";

            try
            {
                VehicleDuty domainObj = new VehicleDuty(id, vehicleId);
            }
            catch (Exception e)
            {
                Assert.Equal("VehicleDutyCode must be 10 characters long", e.Message);
            }
        }
    }
}
