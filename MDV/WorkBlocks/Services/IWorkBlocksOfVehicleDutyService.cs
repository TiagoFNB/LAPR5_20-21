using DDDNetCore.WorkBlocks.Dto;
using System.Threading.Tasks;

namespace DDDNetCore.WorkBlocks.Services
{
    public interface IWorkBlocksOfVehicleDutyService
    {
        public Task<WorkBlockGeneratedDto> AddAsync(string token,WorkBlockGeneratorDto dto);
    }
}
