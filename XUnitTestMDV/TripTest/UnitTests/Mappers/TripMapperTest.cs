using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DDDNetCore.Trips.Domain;
using DDDNetCore.Trips.DTO;
using DDDNetCore.Trips.Services;
using Xunit;

namespace XUnitTestMDV.TripTest.UnitTests.Mappers
{
    public class TripMapperTest
    {

        [Fact]
        public void ShouldMapFromDomain2Dto_NormalSituation1()
        {
            //Request simulation variables
            string path = "path";
            string line = "line";
            List<int> Lpassing = new List<int>();
            Lpassing.Add(50);



            Trip domainObj = new Trip(path, line, Lpassing);

            RegisterTripsDto dtoObj = new RegisterTripsDto(path,line,50,0,0);

            //Run the mapper
            var mapper = new TripMapper();

            var result = mapper.MapFromDomain2Dto(domainObj);

            Assert.Equal(dtoObj.PathId, result.PathId);
            Assert.Equal(dtoObj.LineId, result.LineId);
            Assert.Equal(dtoObj.StartingTime, result.PassingTimes[0]);

        }

        [Fact]
        public void ShouldMapFromDomain2Dto_NormalSituation2()
        {
            //Request simulation variables
            string path = "path";
            string line = "line";
            List<int> Lpassing = new List<int>();
            Lpassing.Add(50);

            Trip domainObj = new Trip(path, line, Lpassing);

            RegisterTripsDto dtoObj = new RegisterTripsDto(path, line, Lpassing[0], 0, 0);
            dtoObj.PassingTimes = Lpassing;
            //Run the mapper
            var mapper = new TripMapper();

            var result = mapper.MapFromRegisterTripDtoToDomain(dtoObj);

            Assert.Equal(domainObj.Path, result.Path);
            Assert.Equal(domainObj.Line, result.Line);
            Assert.Equal(domainObj.PassingTimes[0], result.PassingTimes[0]);

        }
    }
}
