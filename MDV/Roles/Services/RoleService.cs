using DDDSample1.Domain.Shared;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DDDSample1.Domain.Roles
{
    public class RoleService : IRoleService
    {

        private readonly IUnitOfWork _unitOfWork;
      
        private readonly IRoleRepository _repoRoles;
        private readonly IRoleMapper _mapper;

        public RoleService(IUnitOfWork unitOfWork, IRoleRepository repoRoles, IRoleMapper mapper )
        {
            this._unitOfWork = unitOfWork;
          
            this._repoRoles = repoRoles;
            this._mapper = mapper;
        }


        public async Task<CreateRoleDto> AddAsync(CreateRoleDto dto)
        {
            var globalValidation = await GetRoleByName(dto.Name);

            if (globalValidation != null)
            {
                throw new InvalidOperationException("That role already exists in the system");
            }

            Role role = _mapper.FromDTO2Domain(dto);
           
           

           

            //RoleDataSchema roleschema = _mapper.FromDomain2Persistance(role);

            await this._repoRoles.AddAsync(role);

            await this._unitOfWork.CommitAsync();

            // CreateRoleDto createRoleDto = _mapper.(user);

            return _mapper.FromDomain2Dto(role);

            

        }

        public async Task<CreateRoleDto> GetRoleByName(string name)
        {
          var role =  await this._repoRoles.GetByIdAsync(new RoleName(name));
            if (role != null)
            {
               // var role = _mapper.FromPersistence2Domain(roleDataSchema);
                var roleDto = _mapper.FromDomain2Dto(role);
                return roleDto;
            }
            return null;
           
        }

        }
}
