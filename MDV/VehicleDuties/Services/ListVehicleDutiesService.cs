using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DDDNetCore.VehicleDuties.Domain;
using DDDNetCore.VehicleDuties.Dto;
using DDDNetCore.VehicleDuties.Mappers;
using DDDNetCore.VehicleDuties.Repository;

namespace DDDNetCore.VehicleDuties.Services
{
    public class ListVehicleDutiesService : IListVehicleDutiesService
    {
        private readonly IVehicleDutyRepository _repo;
        private readonly IVehicleDutyMapper _mapper;

        public ListVehicleDutiesService(IVehicleDutyRepository repo,
            IVehicleDutyMapper mapper)
        {
            this._repo = repo;
            this._mapper = mapper;
        }
        public async Task<List<VehicleDutyDto>> GetAllAsync()
        {
            List<VehicleDuty> list = await this._repo.GetAllAsync();

            List<VehicleDutyDto> result = list.Select(trip => _mapper.MapFromDomain2Dto(trip)).ToList();

            return result;
        }
        
    }
}
