using DDDNetCore.ImportFile.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Xunit;

namespace XUnitTestMDV.ImportFileTest.Models
{
    public class DriverDutiesModelTest
    {


        [Fact]
        public void ShouldCreateAndAddADriverDutyModel()
        {
            string rName = null;

            DriverDutiesModel m = new DriverDutiesModel();

            List<string> wbs = new List<string>();
            m.addDriverDuty("DriverDut1",wbs);

            Assert.True(m.errors.Count == 0);
            Assert.True(m.DriverDuties[0].driverDutyDto.DriverDutyCode.Equals("DriverDut1"));
        }


        [Fact]
        public void ShouldNotAddADriverDutyModel_DriverDutyCodeIsEmpty()
        {
            string rName = null;

            DriverDutiesModel m = new DriverDutiesModel();

            List<string> wbs = new List<string>();
            m.addDriverDuty("", wbs);
            Assert.True(m.errors.Count == 1);
            Assert.Throws<ArgumentOutOfRangeException>(() => m.DriverDuties[0]);
            
        }

        [Fact]
        public void ShouldNotAddADriverDutyModel_DriverDutyCodeIsNull()
        {
            string rName = null;
            List<string> wbs = new List<string>();
            DriverDutiesModel m = new DriverDutiesModel();

            m.addDriverDuty(null,wbs);
            Assert.True(m.errors.Count == 1);
            Assert.Throws<ArgumentOutOfRangeException>(() => m.DriverDuties[0]);

        }


        [Fact]
        public void ShouldNotAddADriverDutyModel_DriverDutyCodeIsNotAlphaNumeric()
        {
            string rName = "DriverDu:1";
            List<string> wbs = new List<string>();
            DriverDutiesModel m = new DriverDutiesModel();

            m.addDriverDuty(null,wbs);
            Assert.True(m.errors.Count == 1);
            Assert.Throws<ArgumentOutOfRangeException>(() => m.DriverDuties[0]);

        }


        [Fact]
        public void ShouldNotAddADriverDutyModel_DriverDutyCodeDontHave10Chars()
        {
            string rName = "DriverDu";

            DriverDutiesModel m = new DriverDutiesModel();
            List<string> wbs = new List<string>();

            m.addDriverDuty(null,wbs);
            Assert.True(m.errors.Count == 1);
            Assert.Throws<ArgumentOutOfRangeException>(() => m.DriverDuties[0]);

        }
    }
}
