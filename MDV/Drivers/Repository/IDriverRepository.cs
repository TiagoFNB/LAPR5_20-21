using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DDDNetCore.Drivers.Domain;
using DDDNetCore.Drivers.Domain.ValueObjects;
using DDDSample1.Domain.Shared;

namespace DDDNetCore.Drivers.Repository
{
    public interface IDriverRepository : IRepository<Driver,DriverMechanographicNumber>
    {


        public Task<List<Driver>> filterById(string id);
    }
}
