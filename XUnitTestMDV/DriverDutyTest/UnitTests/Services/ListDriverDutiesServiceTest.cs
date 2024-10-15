using DDDNetCore.DriverDuties.Domain;
using DDDNetCore.DriverDuties.Dto;
using DDDNetCore.DriverDuties.Mappers;
using DDDNetCore.DriverDuties.Repository;
using DDDNetCore.DriverDuties.Services;
using Moq;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;

namespace XUnitTestMDV.DriverDutyTest.UnitTests.Services
{
    public class ListDriverDutiesServiceTest
    {
        [Fact]
        public async void ShouldListDriverDuties_NormalSituation1()
        {
            List<DriverDuty> repoRes = new List<DriverDuty>();
            repoRes.Add(new DriverDuty());
            repoRes.Add(new DriverDuty());

            DriverDutyDto mapperRes = new DriverDutyDto("1234567890","123456789");

            //Mock dependencies
            var mapper = new Mock<IDriverDutyMapper>();
            mapper.Setup(o => o.MapFromDomain2Dto(It.IsAny<DriverDuty>()))
               .Returns(mapperRes);

            var driverDutyRepo = new Mock<IDriverDutyRepository>();
            driverDutyRepo.Setup(o => o.GetAllAsync())
               .Returns(Task.FromResult(repoRes));


            //Run the service
            var serv = new ListDriverDutiesService(driverDutyRepo.Object, mapper.Object);

            var result = await serv.GetAllAsync();

            Assert.Equal(result.Count, repoRes.Count);

            for(int i = 0; i < repoRes.Count; i++)
            {
                Assert.Equal(result[i], mapperRes);
            }
            
        }

        [Fact]
        public async void ShouldListDriverDuties_NormalSituation2_EmptyList()
        {
            List<DriverDuty> repoRes = new List<DriverDuty>();

            DriverDutyDto mapperRes = new DriverDutyDto("1234567890", "123456789");

            //Mock dependencies
            var mapper = new Mock<IDriverDutyMapper>();
            mapper.Setup(o => o.MapFromDomain2Dto(It.IsAny<DriverDuty>()))
               .Returns(mapperRes);

            var driverDutyRepo = new Mock<IDriverDutyRepository>();
            driverDutyRepo.Setup(o => o.GetAllAsync())
               .Returns(Task.FromResult(repoRes));


            //Run the service
            var serv = new ListDriverDutiesService(driverDutyRepo.Object, mapper.Object);

            var result = await serv.GetAllAsync();

            Assert.Equal(result.Count, repoRes.Count);

            for (int i = 0; i < repoRes.Count; i++)
            {
                Assert.Equal(result[i], mapperRes);
            }

        }
    }
}
