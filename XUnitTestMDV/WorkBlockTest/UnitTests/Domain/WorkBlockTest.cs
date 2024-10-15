using DDDNetCore.Trips.Domain;
using DDDNetCore.WorkBlocks.Domain;
using System;
using System.Collections.Generic;
using Xunit;

namespace XUnitTestMDV.WorkBlockTest.UnitTests.Domain
{
    public class WorkBlockTest
    {

        [Fact]
        public void ShouldCreateWorkblock_NormalSituation1()
        {
            DateTime startDateTime = new DateTime(2002, 10, 18);
            DateTime endDateTime = new DateTime(2002, 10, 18);
            string driverDutyCode = "wkblockDT1";
            string vehicleDutyCode = "wkblockVT1";
            List<Trip> trips = new List<Trip>();

            WorkBlock domainObj = new WorkBlock(startDateTime, endDateTime,driverDutyCode,vehicleDutyCode, trips);

            Assert.Equal(startDateTime, domainObj.StartDateTime.DateTime);
            Assert.Equal(endDateTime, domainObj.EndDateTime.DateTime);
            Assert.Equal(driverDutyCode, domainObj.DriverDutyCode.Value);
            Assert.Equal(vehicleDutyCode, domainObj.VehicleDutyCode.Value);
            Assert.Equal(trips, domainObj.Trips);
        }

        [Fact]
        public void ShouldCreateWorkblock_NormalSituation2_NullDriverDutyCode()
        {
            DateTime startDateTime = new DateTime(2002, 10, 18);
            DateTime endDateTime = new DateTime(2002, 10, 18);
            string driverDutyCode = null;
            string vehicleDutyCode = "wkblockVT1";
            List<Trip> trips = new List<Trip>();

            WorkBlock domainObj = new WorkBlock(startDateTime, endDateTime, driverDutyCode, vehicleDutyCode, trips);

            Assert.Equal(startDateTime, domainObj.StartDateTime.DateTime);
            Assert.Equal(endDateTime, domainObj.EndDateTime.DateTime);
            Assert.Null(domainObj.DriverDutyCode);
            Assert.Equal(vehicleDutyCode, domainObj.VehicleDutyCode.Value);
            Assert.Equal(trips, domainObj.Trips);
        }

        [Fact]
        public void ShouldCreateWorkblock_ExceptionOcurred_InvalidNull()
        {
            DateTime startDateTime = new DateTime(2002, 10, 18);
            DateTime endDateTime = new DateTime(2002, 10, 18);
            string driverDutyCode = "wkblockDT1";
            string vehicleDutyCode = null;
            List<Trip> trips = new List<Trip>();

            try
            {
                WorkBlock domainObj = new WorkBlock(startDateTime, endDateTime, driverDutyCode, vehicleDutyCode, trips);
                Assert.False(true); //If it reaches here, test should fail
            }
            catch (Exception e)
            {
                Assert.Equal("Object reference not set to an instance of an object.", e.Message);
            }
        }

        [Fact]
        public void ShouldCreateWorkblock_ExceptionOcurred_EndDateEarlierThanStartDate()
        {
            DateTime startDateTime = new DateTime(2001, 10, 18);
            DateTime endDateTime = new DateTime(2000, 10, 18);
            string driverDutyCode = "wkblockDT1";
            string vehicleDutyCode = "wkblockVT1";
            List<Trip> trips = new List<Trip>();

            try
            {
                WorkBlock domainObj = new WorkBlock(startDateTime, endDateTime, driverDutyCode, vehicleDutyCode, trips);
                Assert.False(true); //If it reaches here, test should fail
            }
            catch (Exception e)
            {
                Assert.Equal("WorkBlock end time has to be earlier than the start time.", e.Message);
            }
        }
    }
}
