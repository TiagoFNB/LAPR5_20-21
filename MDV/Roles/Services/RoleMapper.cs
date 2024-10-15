
using DDDSample1.Domain.Roles;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DDDSample1.Domain.Roles
{
    public class RoleMapper : IRoleMapper
    {

        
        public RoleMapper()
        {
            
        }
        


        public Role FromDTO2Domain(CreateRoleDto dto)
        {
            
            
                return new Role(dto.Name);
            

           


        }
       

        //public RoleDataSchema FromDomain2Persistance(Role role)
        //{
        //    var d = new _roleDataSchema("asdas", "dadsa");
        //    return new RoleDataSchema(role.Id, role.Name.Name);
        //}
        //public Role FromPersistence2Domain(RoleDataSchema role)
        //{
        //    return new Role(role.Id.AsString(), role.Name);
        //}

        public CreateRoleDto FromDomain2Dto(Role role)
        {
            return new CreateRoleDto(role.Id.Value);
        }
    }
}
