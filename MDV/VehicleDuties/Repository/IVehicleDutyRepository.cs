using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DDDNetCore.VehicleDuties.Domain;
using DDDNetCore.VehicleDuties.Domain.ValueObjects;
using DDDSample1.Domain.Shared;

namespace DDDNetCore.VehicleDuties.Repository
{
    public interface IVehicleDutyRepository : IRepository<VehicleDuty, VehicleDutyCode>
    {
    }
}
