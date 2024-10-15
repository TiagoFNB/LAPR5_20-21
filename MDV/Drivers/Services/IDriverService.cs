using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DDDNetCore.Drivers.Dto;

namespace DDDNetCore.Drivers.Services
{
    public interface IDriverService
    {
        public Task<DriverDto> AddAsync(string token, DriverDto dto);
        public Task<List<DriverDto>> FilterBy(string id);

        public Task<List<DriverDto>> ObtainAllDrivers();
    }
}
