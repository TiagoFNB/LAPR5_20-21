
using DDDSample1.Domain.Shared;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DDDSample1.Domain.Roles // DDDNetCore.Domain.Users.Repository
{
    public interface IRoleRepository : IRepository<Role, RoleName>
    {

        //public  Task<Role> GetByNameAsync(string name);
    }
}
