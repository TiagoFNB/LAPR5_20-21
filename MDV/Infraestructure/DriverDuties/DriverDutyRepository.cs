using DDDNetCore.DriverDuties.Domain;
using DDDNetCore.DriverDuties.Domain.ValueObjects;
using DDDNetCore.DriverDuties.Repository;
using DDDSample1.Infrastructure;
using DDDSample1.Infrastructure.Shared;
using Microsoft.EntityFrameworkCore;

namespace DDDNetCore.Infraestructure.DriverDuties
{
    public class DriverDutyRepository : BaseRepository<DriverDuty, DriverDutyCode>, IDriverDutyRepository
    {
        private readonly DbSet<DriverDuty> _objs;
        public DriverDutyRepository(MDVDbContext context) : base(context.DriverDuties)
        {
            this._objs = context.DriverDuties;
        }

    }
}
