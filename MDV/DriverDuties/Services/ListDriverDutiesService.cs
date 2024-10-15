using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DDDNetCore.DriverDuties.Domain;
using DDDNetCore.DriverDuties.Dto;
using DDDNetCore.DriverDuties.Mappers;
using DDDNetCore.DriverDuties.Repository;

namespace DDDNetCore.DriverDuties.Services
{
    public class ListDriverDutiesService : IListDriverDutiesService
    {
        private readonly IDriverDutyRepository _repo;
        private readonly IDriverDutyMapper _mapper;

        public ListDriverDutiesService(IDriverDutyRepository repo,
            IDriverDutyMapper mapper)
        {
            this._repo = repo;
            this._mapper = mapper;
        }
        public async Task<List<DriverDutyDto>> GetAllAsync()
        {
            List<DriverDuty> list = await this._repo.GetAllAsync();

            List<DriverDutyDto> result = list.Select(obj => _mapper.MapFromDomain2Dto(obj)).ToList();

            return result;
        }

    }
}
