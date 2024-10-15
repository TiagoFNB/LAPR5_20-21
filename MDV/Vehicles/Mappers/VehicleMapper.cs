using DDDNetCore.Vehicles.Domain;
using DDDNetCore.Vehicles.Dto;

namespace DDDNetCore.Vehicles.Mappers
{
    public class VehicleMapper : IVehicleMapper
    {


        public VehicleMapper()
        {

        }

        public Vehicle MapFromVehicleDtoToDomain(VehicleDto vehicleDto)
        {
            return new Vehicle(vehicleDto.License, vehicleDto.Vin, vehicleDto.Type, vehicleDto.Date);

        }

        public VehicleDto MapFromDomain2Dto(Vehicle v)
        {

            return new VehicleDto(v.Id.Value, v.Vin.Vin, v.Type.Type, v.Date.EntryDateOfService);
        }
    }
}
