using DDDSample1.Domain.Roles;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DDDSample1.Domain.Roles
{
    public interface IRoleService
    {

        public  Task<CreateRoleDto> AddAsync(CreateRoleDto dto);
        public  Task<CreateRoleDto> GetRoleByName(string name);
    }
}
