using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DDDNetCore.Drivers.Domain;
using DDDNetCore.Drivers.Domain.ValueObjects;
using DDDNetCore.Drivers.Repository;
using DDDSample1.Infrastructure;
using DDDSample1.Infrastructure.Shared;
using Microsoft.EntityFrameworkCore;
namespace DDDNetCore.Infraestructure.Drivers
{
    public class DriverRepository : BaseRepository<Driver, DriverMechanographicNumber>, IDriverRepository
    {
        private readonly DbSet<Driver> _objs;
        public DriverRepository(MDVDbContext context) : base(context.Drivers)
        {
            this._objs = context.Drivers;
        }


        public async Task<List<Driver>> filterById(string id)
        {

               DriverMechanographicNumber i = new DriverMechanographicNumber("123456789");
            var xpto = id + "%";   
            // podia ter posto $@  e nao so $
            string query = $"SELECT * FROM dbo.Drivers  WHERE MechanographicNumber LIKE '{xpto}'";
            var list = await this._objs.FromSqlRaw(query).ToListAsync();


            return list;
 


        }

    }
}
