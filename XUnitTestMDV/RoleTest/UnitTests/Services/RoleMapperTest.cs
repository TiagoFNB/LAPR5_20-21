using DDDSample1.Domain.Roles;
using DDDSample1.Domain.Shared;

using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Xunit;

namespace XUnitTestMDV.Role.Services
{
    public class RoleMapperTest
    {


        [Fact]
        public  void ShouldMapCreateRoleDto2Domain()
        {
            // START THE MOCKS
            DDDSample1.Domain.Roles.RoleMapper roleMapper = new DDDSample1.Domain.Roles.RoleMapper();
            CreateRoleDto dto = new CreateRoleDto("name");
           var role = roleMapper.FromDTO2Domain(dto);

            Assert.Equal(role.Id.Value, dto.Name);
        }


        [Fact]
        public  void ShouldNotMapCreateRoleDto2Domain() // invalid name
        {
            // START THE MOCKS
            DDDSample1.Domain.Roles.RoleMapper roleMapper = new DDDSample1.Domain.Roles.RoleMapper();
            CreateRoleDto dto = new CreateRoleDto("");
            
           
             Assert.Throws<InvalidOperationException>(() => roleMapper.FromDTO2Domain(dto));
     
        }


        [Fact]
        public void ShouldMapDomain2CreateRoleDto()
        {
            // START THE MOCKS
            DDDSample1.Domain.Roles.RoleMapper roleMapper = new DDDSample1.Domain.Roles.RoleMapper();
            DDDSample1.Domain.Roles.Role role = new DDDSample1.Domain.Roles.Role("name");
            var dto = roleMapper.FromDomain2Dto(role);

            Assert.Equal(role.Id.Value, dto.Name);
        }


        


    }
}
