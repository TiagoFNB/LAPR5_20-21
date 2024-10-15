using DDDNetCore.ImportFile.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Xunit;

namespace XUnitTestMDV.ImportFileTest.Models
{
    public class WorkBlocksModelTest
    {


        [Fact]
        public void ShouldAddAWorkBlockModel()
        {
           

            WorkBlocksModel m = new WorkBlocksModel();

            List<string> wbTrips = new List<string>();
            wbTrips.Add("Trip1");
            wbTrips.Add("Trip2");

            m.addWorkBlock("WB:1", "200", "300", wbTrips);



            DateTime Date = DateTime.Today.AddSeconds(200);

            

            Assert.True(m.workBlocksList[0].key.Equals("WB:1"));
            Assert.True(m.workBlocksList[0].workBlockDTO.MaxBlocks.Equals(1));
            Assert.True(m.workBlocksList[0].workBlockDTO.Date.Equals(Date));
        }


        [Fact]
        public void ShouldNotAddAWorkBlockModel_DurationIsNegative()
        {


            WorkBlocksModel m = new WorkBlocksModel();

            List<string> wbTrips = new List<string>();
            wbTrips.Add("Trip1");
            wbTrips.Add("Trip2");

            m.addWorkBlock("WB:1", "400", "300", wbTrips);







            Assert.True(m.errors.Count == 1);
            Assert.Throws<ArgumentOutOfRangeException>(() => m.workBlocksList[0]);
        }

        [Fact]
        public void ShouldNotAddAWorkBlockModel_StartAndEndTimeAreNotAnumber()
        {


            WorkBlocksModel m = new WorkBlocksModel();

            List<string> wbTrips = new List<string>();
            wbTrips.Add("Trip1");
            wbTrips.Add("Trip2");

            m.addWorkBlock("WB:1", "notNumber", "notNumber", wbTrips);



            Assert.True(m.errors.Count == 1);
            Assert.Throws<ArgumentOutOfRangeException>(() => m.workBlocksList[0]);
        }
    


    [Fact]
    public void ShouldNotAddAWorkBlockModel_KeyIsNull()
    {


        WorkBlocksModel m = new WorkBlocksModel();

        List<string> wbTrips = new List<string>();
        wbTrips.Add("Trip1");
        wbTrips.Add("Trip2");

        m.addWorkBlock(null, "200", "300", wbTrips);



        Assert.True(m.errors.Count == 1);
        Assert.Throws<ArgumentOutOfRangeException>(() => m.workBlocksList[0]);
    }



        [Fact]
        public void ShouldNotAddAWorkBlockModel_KeyIsEmpty()
        {


            WorkBlocksModel m = new WorkBlocksModel();

            List<string> wbTrips = new List<string>();
            wbTrips.Add("Trip1");
            wbTrips.Add("Trip2");

            m.addWorkBlock("", "200", "300", wbTrips);



            Assert.True(m.errors.Count == 1);
            Assert.Throws<ArgumentOutOfRangeException>(() => m.workBlocksList[0]);
        }
    }
}
