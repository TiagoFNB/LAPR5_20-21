using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DDDNetCore.VehicleDuties.Domain;
using DDDNetCore.VehicleDuties.Dto;

namespace DDDNetCore.VehicleDuties.Mappers
{
    public interface IVehicleDutyMapper
    {
        public VehicleDuty MapFromVehicleDutyDtoToDomain(VehicleDutyDto dto);

        public VehicleDutyDto MapFromDomain2Dto(VehicleDuty vehicleDuty);
    }
}