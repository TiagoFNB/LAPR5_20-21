using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DDDNetCore.Vehicles.Domain;
using DDDNetCore.Vehicles.Repository;
using DDDNetCore.Vehicles.ValueObjects;
using DDDSample1.Infrastructure;
using DDDSample1.Infrastructure.Shared;
using Microsoft.EntityFrameworkCore;

namespace DDDNetCore.Infraestructure.Vehicles
{
    public class VehicleRepository : BaseRepository<Vehicle, VehicleLicense>, IVehicleRepository
    {
        private readonly DbSet<Vehicle> _objs;
        public VehicleRepository(MDVDbContext context) : base(context.Vehicles)
        {
            this._objs = context.Vehicles;
        }

    }
}
