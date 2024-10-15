using DDDNetCore.Trips.Domain;
using DDDNetCore.WorkBlocks.Domain;
using DDDNetCore.WorkBlocks.Dto;
using DDDNetCore.WorkBlocks.Mappers;
using System;
using System.Collections.Generic;
using Xunit;

namespace XUnitTestMDV.WorkBlockTest.UnitTests.Mappers
{
    public class WorkBlockMapperTest
    {
        [Fact]
        public void ShouldMapFromDomainToGeneratedDto_NormalSituation1()
        {
            //Create the input list
            List<WorkBlock> inputList = new List<WorkBlock>();

            //Create trips list
            List<Trip> trips = new List<Trip>();

            List<int> passingTimes = new List<int>();
            passingTimes.Add(11);
            passingTimes.Add(222);
            passingTimes.Add(3333);

            Trip tp1 = new Trip("pId1", "lId1", passingTimes);
            Trip tp2 = new Trip("pId2", "lId2", passingTimes);

            trips.Add(tp1);
            trips.Add(tp2);

            //Create the workBlocks
            WorkBlock wk1 = new WorkBlock(new DateTime(2002, 10, 18), new DateTime(2002, 10, 18), "wkblockDT1", "wkblockVT1", trips);
            WorkBlock wk2 = new WorkBlock(new DateTime(2002, 10, 18), new DateTime(2002, 10, 18), "wkblockDT2", "wkblockVT2", trips);

            inputList.Add(wk1);
            inputList.Add(wk2);

            //Run the mapper
            var mapper = new WorkBlockMapper();

            WorkBlockGeneratedDto result = mapper.MapFromDomainToGeneratedDto(inputList);

            Assert.Equal(result.Wks.Length,inputList.Count);
            Assert.Equal("wkblockDT1",result.Wks[0].DriverDutyCode);
            Assert.Equal("wkblockVT1",result.Wks[0].VehicleDutyCode);
            Assert.Equal("wkblockDT2", result.Wks[1].DriverDutyCode);
            Assert.Equal("wkblockVT2", result.Wks[1].VehicleDutyCode);
        }

        [Fact]
        public void ShouldMapFromDomainToGeneratedDto_NormalSituation2_0WorkBlocks()
        {
            //Create the input list
            List<WorkBlock> inputList = new List<WorkBlock>();

            //Run the mapper
            var mapper = new WorkBlockMapper();

            WorkBlockGeneratedDto result = mapper.MapFromDomainToGeneratedDto(inputList);

            Assert.Equal(result.Wks.Length, inputList.Count);
        }

    }
}
