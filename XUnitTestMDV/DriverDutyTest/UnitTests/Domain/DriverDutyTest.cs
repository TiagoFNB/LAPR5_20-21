using DDDNetCore.DriverDuties.Domain;
using System;
using Xunit;

namespace XUnitTestMDV.DriverDutyTest.UnitTests.Domain
{
    public class DriverDutyTest
    {

        [Fact]
        public void ShouldCreateDriverDuty_NormalSituation1()
        {
            string id = "0123456789";
            string driverId = "123456789";

            DriverDuty domainObj = new DriverDuty(id,driverId);

            Assert.Equal(id, domainObj.Id.Value);
            Assert.Equal(driverId, domainObj.DriverMecNumber.Value);
        }

        [Fact]
        public void ShouldCreateDriverDuty_ExceptionOcurred_InvalidId_Null()
        {
            string id = null;
            string driverId = "123456789";

            try
            {
                DriverDuty domainObj = new DriverDuty(id, driverId);
            }catch(Exception e)
            {
                Assert.Equal("Object reference not set to an instance of an object.", e.Message);
            }
        }

        [Fact]
        public void ShouldCreateDriverDuty_ExceptionOcurred_InvalidId_NotAlphanumeric()
        {
            string id = "abc-d";
            string driverId = "123456789";

            try
            {
                DriverDuty domainObj = new DriverDuty(id, driverId);
            }
            catch (Exception e)
            {
                Assert.Equal("DriverDutyCode must be alphanumeric", e.Message);
            }
        }

        [Fact]
        public void ShouldCreateDriverDuty_ExceptionOcurred_InvalidId_Not10CharLong()
        {
            string id = "abcd";
            string driverId = "123456789";

            try
            {
                DriverDuty domainObj = new DriverDuty(id, driverId);
            }
            catch (Exception e)
            {
                Assert.Equal("DriverDutyCode must be 10 characters long", e.Message);
            }
        }
    }
}
