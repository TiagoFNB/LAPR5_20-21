using DDDNetCore.Vehicles.Domain;
using DDDNetCore.Vehicles.Dto;

namespace DDDNetCore.Vehicles.Mappers
{
    public interface IVehicleMapper
    {
        public Vehicle MapFromVehicleDtoToDomain(VehicleDto vehicleDto);
        public VehicleDto MapFromDomain2Dto(Vehicle v);
    }
}
