using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DDDNetCore.Vehicles.Domain;
using DDDNetCore.Vehicles.ValueObjects;
using DDDSample1.Domain.Shared;

namespace DDDNetCore.Vehicles.Repository
{
    public interface IVehicleRepository : IRepository<Vehicle, VehicleLicense>
    {
        
    }
}
