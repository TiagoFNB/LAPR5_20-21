using DDDNetCore.Drivers.Domain;
using DDDNetCore.Drivers.Dto;

namespace DDDNetCore.Drivers.Mappers
{
    public interface IDriverMapper
    {
        public Driver MapFromDriverDtoToDomain(DriverDto driverDto);
        public DriverDto MapFromDomain2Dto(Driver v);
    }
}
