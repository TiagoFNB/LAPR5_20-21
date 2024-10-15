using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DDDNetCore.VehicleDuties.Domain;
using DDDNetCore.VehicleDuties.Domain.ValueObjects;
using DDDNetCore.VehicleDuties.Repository;
using DDDSample1.Infrastructure;
using DDDSample1.Infrastructure.Shared;
using Microsoft.EntityFrameworkCore;

namespace DDDNetCore.Infraestructure.VehicleDuties
{
    public class VehicleDutyRepository : BaseRepository<VehicleDuty, VehicleDutyCode>, IVehicleDutyRepository
    {
        private readonly DbSet<VehicleDuty> _objs;
        public VehicleDutyRepository(MDVDbContext context) : base(context.VehicleDuties)
        {
            this._objs = context.VehicleDuties;
        }

    }
}