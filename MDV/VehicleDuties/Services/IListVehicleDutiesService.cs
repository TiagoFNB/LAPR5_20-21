using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DDDNetCore.VehicleDuties.Dto;

namespace DDDNetCore.VehicleDuties.Services
{
    public interface IListVehicleDutiesService
    {
        public Task<List<VehicleDutyDto>> GetAllAsync();
    }
}
