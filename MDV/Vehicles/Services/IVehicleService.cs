using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DDDNetCore.Vehicles.Dto;

namespace DDDNetCore.Vehicles.Services
{
    public interface IVehicleService
    {
        public Task<VehicleDto> AddAsync(string token,VehicleDto dto);
        public Task<List<VehicleDto>> GetAll();
    }

}
