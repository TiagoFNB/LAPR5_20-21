using System.Collections.Generic;
using System.Threading.Tasks;
using DDDNetCore.DriverDuties.Dto;

namespace DDDNetCore.DriverDuties.Services
{
    public interface IListDriverDutiesService
    {
        public Task<List<DriverDutyDto>> GetAllAsync();
    }
}
