using DDDNetCore.ImportFile.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Xunit;

namespace XUnitTestMDV.ImportFileTest.Models
{
    public class TripsModelTest
    {


        [Fact]
        public void ShouldAddATrip()
        {
            

            TripsModel m = new TripsModel();

            m.addTrip("Trip:1","path:1","line:3","200");

            Assert.True(m.TripsDtoList[0].Key.Equals("Trip:1"));
        }


        [Fact]
        public void ShouldNotAddTrip_TripKeyIsEmpty()
        {


            TripsModel m = new TripsModel();

            m.addTrip("", "path:1", "line:3", "200");

            Assert.True(m.errors.Count == 1);
            Assert.Throws<ArgumentOutOfRangeException>(() => m.TripsDtoList[0]);
        }


        [Fact]
        public void ShouldNotAddTrip_TripKeyIsNull()
        {


            TripsModel m = new TripsModel();

            m.addTrip(null, "path:1", "line:3", "200");

            Assert.True(m.errors.Count == 1);
            Assert.Throws<ArgumentOutOfRangeException>(() => m.TripsDtoList[0]);
        }


        [Fact]
        public void ShouldNotAddTrip_StartingTimeCantBeParsedToNumber()
        {


            TripsModel m = new TripsModel();


            m.addTrip("Trip:1", "path:1", "line:3", "cant parse");

            Assert.Throws<ArgumentOutOfRangeException>(() => m.TripsDtoList[0]);
            Assert.True(m.errors.Count == 1);
        }


       
    }
}
