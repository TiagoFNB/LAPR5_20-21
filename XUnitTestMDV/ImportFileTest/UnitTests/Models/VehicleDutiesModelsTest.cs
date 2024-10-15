using DDDNetCore.ImportFile.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Xunit;

namespace XUnitTestMDV.ImportFileTest.Models
{
    public class VehicleDutiesModelsTest
    {

        [Fact]
        public void ShouldCreateAndAddAVehicleDutyModel()
        {
            string rName = null;

            VehicleDutiesModel m = new VehicleDutiesModel();

            m.addVehicleDuties("VehicleDu1");

            Assert.True(m.errors.Count == 0);
            Assert.True(m.VehicleDutyDtoList[0].VehicleDutyCode.Equals("VehicleDu1"));
        }

        [Fact]
        public void ShouldNotAddAVehicleDutyModel_VehicleDutyCodeIsEmpty()
        {
            string rName = null;

            VehicleDutiesModel m = new VehicleDutiesModel();

            m.addVehicleDuties("");
            Assert.True(m.errors.Count == 1);
            Assert.Throws<ArgumentOutOfRangeException>(() => m.VehicleDutyDtoList[0]);

        }

        [Fact]
        public void ShouldNotAddAVehicleDutyModel_VehicleDutyCodeIsNull()
        {
            string rName = null;

            VehicleDutiesModel m = new VehicleDutiesModel();

            m.addVehicleDuties(null);
            Assert.True(m.errors.Count == 1);
            Assert.Throws<ArgumentOutOfRangeException>(() => m.VehicleDutyDtoList[0]);

        }

        [Fact]
        public void ShouldNotAddAVehicleDutyModel_VehicleDutyCodeIsNotAlphaNumeric()
        {
            string rName = "veicDu:1";

            VehicleDutiesModel m = new VehicleDutiesModel();

            m.addVehicleDuties(null);
            Assert.True(m.errors.Count == 1);
            Assert.Throws<ArgumentOutOfRangeException>(() => m.VehicleDutyDtoList[0]);

        }


        [Fact]
        public void ShouldNotAddAVehicleDutyModel_VehicleDutyCodeDontHave10Chars()
        {
            string rName = "veicDu";

            VehicleDutiesModel m = new VehicleDutiesModel();

            m.addVehicleDuties(null);
            Assert.True(m.errors.Count == 1);
            Assert.Throws<ArgumentOutOfRangeException>(() => m.VehicleDutyDtoList[0]);

        }
    }
}
