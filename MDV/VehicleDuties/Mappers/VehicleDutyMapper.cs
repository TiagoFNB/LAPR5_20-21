using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DDDNetCore.VehicleDuties.Domain;
using DDDNetCore.VehicleDuties.Dto;

namespace DDDNetCore.VehicleDuties.Mappers
{
    public class VehicleDutyMapper : IVehicleDutyMapper
    {
        public VehicleDutyDto MapFromDomain2Dto(VehicleDuty vehicleDuty)
        {
            if (vehicleDuty.VehicleLicense != null)
            {
                return new VehicleDutyDto(vehicleDuty.Id.Value, vehicleDuty.VehicleLicense.Value);
            }
            return new VehicleDutyDto(vehicleDuty.Id.Value, null);
        }

        public VehicleDuty MapFromVehicleDutyDtoToDomain(VehicleDutyDto dto)
        {
            return new VehicleDuty(dto.VehicleDutyCode, dto.VehicleLicense);
        }
    }
}
