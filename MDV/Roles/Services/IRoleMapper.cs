using DDDSample1.Domain.Roles;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DDDSample1.Domain.Roles
{
    public interface IRoleMapper
    {

        //public RoleDataSchema FromDomain2Persistance(Role role);
     

        public Role FromDTO2Domain(CreateRoleDto dto);
        public CreateRoleDto FromDomain2Dto(Role role);
        //public Role FromPersistence2Domain(RoleDataSchema role);
    }
}
