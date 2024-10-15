

using DDDSample1.Domain.Shared;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;


namespace DDDSample1.Domain.Roles // DDDNetCore.Domain.Shared.Roles
{
    public class Role : Entity<RoleName>, IAggregateRoot
    {

       // public RoleName Name { get; }
        private Role()
        {

        }

        public Role(string name)
        {
          //  this.Id = new RoleId(Guid.NewGuid());
            // Name = new RoleName(name);

            this.Id = new RoleName(name);

        }

         

        

       
    }
}
