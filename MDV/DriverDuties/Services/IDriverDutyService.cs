using DDDNetCore.DriverDuties.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DDDNetCore.DriverDuties.Services
{
    public interface IDriverDutyService
    {
        public Task<DriverDutyDto> AddAsync(DriverDutyDto dto);
        public Task<DriverDutyPlannedResponseDto> AddPlannedDriverDutyAsync(DriverDutyPlannedDto dto);
    }
}
