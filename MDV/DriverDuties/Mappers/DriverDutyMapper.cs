using DDDNetCore.DriverDuties.Domain;
using DDDNetCore.DriverDuties.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DDDNetCore.DriverDuties.Mappers
{
    public class DriverDutyMapper : IDriverDutyMapper
    {
        public DriverDutyDto MapFromDomain2Dto(DriverDuty driverDuty)
        {
            if (driverDuty.DriverMecNumber != null)
            {
                return new DriverDutyDto(driverDuty.Id.Value, driverDuty.DriverMecNumber.Value);
            }

            return new DriverDutyDto(driverDuty.Id.Value, null);

        }

        public DriverDuty MapFromDriverDutyDtoToDomain(DriverDutyDto dto)
        {
            return new DriverDuty(dto.DriverDutyCode, dto.DriverMecNumber);
        }

        public DriverDuty MapFromDriverDutyPlannedDtoToDomain(DriverDutyPlannedDto dto)
        {
            if (dto.DriverDutyCode != null)
            {
             return new DriverDuty(dto.DriverDutyCode,dto.DriverMecNumber);
            }
            return new DriverDuty(dto.DriverMecNumber);
        }

        public DriverDutyPlannedResponseDto MapFromDomain2PlannedDto(DriverDuty driverDuty, DriverDutyPlannedDto dto)
        {
            if (driverDuty.DriverMecNumber != null)
            {
                return new DriverDutyPlannedResponseDto(driverDuty.Id.Value, driverDuty.DriverMecNumber.Value, dto.WorkBlockList);
            }

            return new DriverDutyPlannedResponseDto(driverDuty.Id.Value, null, dto.WorkBlockList);



        }
    }
}
