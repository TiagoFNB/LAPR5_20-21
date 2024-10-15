using DDDNetCore.DriverDuties.Domain;
using DDDNetCore.DriverDuties.Dto;

namespace DDDNetCore.DriverDuties.Mappers
{
    public interface IDriverDutyMapper
    {
        public DriverDuty MapFromDriverDutyDtoToDomain(DriverDutyDto dto);

        public DriverDutyDto MapFromDomain2Dto(DriverDuty driverDuty);

        public DriverDutyPlannedResponseDto MapFromDomain2PlannedDto(DriverDuty driverDuty, DriverDutyPlannedDto dto);
        public DriverDuty MapFromDriverDutyPlannedDtoToDomain(DriverDutyPlannedDto dto);
    }
}
