using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DDDNetCore.Trips.Domain;
using Xunit;

namespace XUnitTestMDV.TripTest.UnitTests.Domain
{
    public class TripTest
    {
        [Fact]
        public void ShouldCreateTrip_NormalSituationWithoutKey()
        {
            string path = "path";
            string line = "line";
            List<int> Lpassing = new List<int>();
            Lpassing.Add(50);



            Trip domainObj = new Trip(path,line,Lpassing);

            Assert.Equal(path, domainObj.Path.Path);
            Assert.Equal(line, domainObj.Line.Line);
            Assert.Equal(Lpassing.Count,domainObj.PassingTimes.Count);
            Assert.Equal(Lpassing[0], domainObj.PassingTimes[0].Time);
            Assert.NotNull(domainObj.Id.Value);
        }

        [Fact]
        public void ShouldCreateTrip_NormalSituationWithKey()
        {
            string key = "key";
            string path = "path";
            string line = "line";
            List<int> Lpassing = new List<int>();
            Lpassing.Add(50);



            Trip domainObj = new Trip(key,path, line, Lpassing);

            Assert.Equal(path, domainObj.Path.Path);
            Assert.Equal(line, domainObj.Line.Line);
            Assert.Equal(Lpassing.Count, domainObj.PassingTimes.Count);
            Assert.Equal(Lpassing[0], domainObj.PassingTimes[0].Time);
            Assert.Equal(key,domainObj.Id.Value);
        }

        [Fact]
        public void ShouldNotCreateTrip_noPath()
        {
            string key = "key";
            string path = "path";
            string line = "line";
            List<int> Lpassing = new List<int>();
            Lpassing.Add(50);


            try
            {
                Trip domainObj = new Trip(key, "", line, Lpassing);
                
                Assert.Equal(1,2);
            }
            catch (Exception e)
            {
                Assert.Equal("Undefined path identity.",e.Message);
            }

        }

        [Fact]
        public void ShouldNotCreateTrip_noLine()
        {
            string key = "key";
            string path = "path";
            string line = "line";
            List<int> Lpassing = new List<int>();
            Lpassing.Add(50);


            try
            {
                Trip domainObj = new Trip(key, path, "", Lpassing);

                Assert.Equal(1, 2);
            }
            catch (Exception e)
            {
                Assert.Equal("Undefined line identity.", e.Message);
            }

        }

        [Fact]
        public void ShouldNotCreateTrip_noPassing()
        {
            string key = "key";
            string path = "path";
            string line = "line";
            List<int> Lpassing = new List<int>();
            


            try
            {
                Trip domainObj = new Trip(key, path, line, Lpassing);

                Assert.Equal(1, 2);
            }
            catch (Exception e)
            {
                Assert.Equal("Passing time cant be null.", e.Message);
            }

        }

        [Fact]
        public void ShouldNotCreateTrip_negativePassing()
        {
            string key = "key";
            string path = "path";
            string line = "line";
            List<int> Lpassing = new List<int>();
            Lpassing.Add(0);


            try
            {
                Trip domainObj = new Trip(key, path, line, Lpassing);

                Assert.Equal(1, 2);
            }
            catch (Exception e)
            {
                Assert.Equal("Passing time can't have a value with 0 duration.", e.Message);
            }

        }

        [Fact]
        public void ShouldNotCreateTrip_emptyKey()
        {
            string key = "key";
            string path = "path";
            string line = "line";
            List<int> Lpassing = new List<int>();
            Lpassing.Add(0);


            try
            {
                Trip domainObj = new Trip("", path, line, Lpassing);

                Assert.Equal(1, 2);
            }
            catch (Exception e)
            {
                Assert.Equal("Empty trip key identity.", e.Message);
            }

        }
    }
}
