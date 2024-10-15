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
    public class  RoleServiceTest
    {

        [Fact]
        public async void ShouldCreateRole1()
        {
            // START THE MOCKS
            DDDSample1.Domain.Roles.Role role = new DDDSample1.Domain.Roles.Role("roleTestt");
            DDDSample1.Domain.Roles.CreateRoleDto roleDto = new DDDSample1.Domain.Roles.CreateRoleDto("roleTestt");

            var roleMapper = new Mock<IRoleMapper>();
            roleMapper.Setup(o => o.FromDTO2Domain(roleDto))
              .Returns(role);
              roleMapper.Setup(o => o.FromDomain2Dto(role))
              .Returns(roleDto);

            var roleRepository = new Mock<IRoleRepository>();
            roleRepository.Setup(o=> o.AddAsync(role))
               .Returns(Task.FromResult(role));
            //mocking unit of work
            var unitOfWork = new Mock<IUnitOfWork>();
            unitOfWork.Setup(o => o.CommitAsync())
                .Returns(Task.FromResult(200));
           

            var roleService = new RoleService(unitOfWork.Object, roleRepository.Object, roleMapper.Object);
            // ENDED THE MOCKS

           var result =  await roleService.AddAsync(roleDto);

            Assert.Equal(result.Name, roleDto.Name);
        }



        [Fact]
        public async void ShouldNotCreateRole1() // role name is invalid
        {
            // START THE MOCKS
            DDDSample1.Domain.Roles.Role role = new DDDSample1.Domain.Roles.Role("roleTestt");
            DDDSample1.Domain.Roles.CreateRoleDto roleDto = new DDDSample1.Domain.Roles.CreateRoleDto("");

            var roleMapper = new Mock<IRoleMapper>();
            roleMapper.Setup(o => o.FromDTO2Domain(roleDto))
              .Throws(new Exception());                       //throws here
            roleMapper.Setup(o => o.FromDomain2Dto(role))
            .Returns(roleDto);

            var roleRepository = new Mock<IRoleRepository>();
            roleRepository.Setup(o => o.AddAsync(role))
               .Returns(Task.FromResult(role));
            //mocking unit of work
            var unitOfWork = new Mock<IUnitOfWork>();
            unitOfWork.Setup(o => o.CommitAsync())
                .Returns(Task.FromResult(200));


            var roleService = new RoleService(unitOfWork.Object, roleRepository.Object, roleMapper.Object);
            // ENDED THE MOCKS

           

           await Assert.ThrowsAsync<InvalidOperationException>(() =>  roleService.AddAsync(roleDto));
        }



        [Fact]
        public async void ShouldNotCreateRole2()  // already exists in the system
        {
            // START THE MOCKS
            DDDSample1.Domain.Roles.Role role = new DDDSample1.Domain.Roles.Role("roleTestt");
            DDDSample1.Domain.Roles.CreateRoleDto roleDto = new DDDSample1.Domain.Roles.CreateRoleDto("roleTestt");

            var roleMapper = new Mock<IRoleMapper>();
            roleMapper.Setup(o => o.FromDTO2Domain(roleDto))
              .Returns(role);
            roleMapper.Setup(o => o.FromDomain2Dto(role))
            .Returns(roleDto);

            var roleRepository = new Mock<IRoleRepository>();
            roleRepository.Setup(o => o.AddAsync(role))
               .Returns(Task.FromResult(role));
            //mocking unit of work
            var unitOfWork = new Mock<IUnitOfWork>();
            unitOfWork.Setup(o => o.CommitAsync())
                .Throws(new Exception()); // thows here


            var roleService = new RoleService(unitOfWork.Object, roleRepository.Object, roleMapper.Object);
            // ENDED THE MOCKS

           

            await Assert.ThrowsAsync<System.Exception>(() => roleService.AddAsync(roleDto));
        }


        [Fact]
        public async void ShouldGetRoles1()  
    {
        // START THE MOCKS
        DDDSample1.Domain.Roles.Role role = new DDDSample1.Domain.Roles.Role("roleTestt");
        DDDSample1.Domain.Roles.CreateRoleDto roleDto = new DDDSample1.Domain.Roles.CreateRoleDto("roleTestt");

        var roleMapper = new Mock<IRoleMapper>();
        roleMapper.Setup(o => o.FromDTO2Domain(roleDto))
          .Returns(role);
        roleMapper.Setup(o => o.FromDomain2Dto(role))
        .Returns(roleDto);

        var roleRepository = new Mock<IRoleRepository>();
        roleRepository.Setup(o => o.GetByIdAsync(role.Id))
           .Returns(Task.FromResult(role));
        //mocking unit of work // not used here
        var unitOfWork = new Mock<IUnitOfWork>();
            // ENDED THE MOCKS


            var roleService = new RoleService(unitOfWork.Object, roleRepository.Object, roleMapper.Object);
           

            var result = await roleService.GetRoleByName(role.Id.Value);
            Assert.Equal(role.Id.Value, result.Name);
           
    }


        [Fact]
        public async void ShouldNotGetRoles1() // theres no role with such name in db
        {
            // START THE MOCKS
            DDDSample1.Domain.Roles.Role Expectedrole = null;
            DDDSample1.Domain.Roles.Role role = new DDDSample1.Domain.Roles.Role("roleTestt");
            DDDSample1.Domain.Roles.CreateRoleDto roleDto = new DDDSample1.Domain.Roles.CreateRoleDto("roleTestt");

            var roleMapper = new Mock<IRoleMapper>();
            roleMapper.Setup(o => o.FromDTO2Domain(roleDto))
              .Returns(role);
            roleMapper.Setup(o => o.FromDomain2Dto(role))
            .Returns(roleDto);

            var roleRepository = new Mock<IRoleRepository>();
            roleRepository.Setup(o => o.GetByIdAsync(role.Id))
               .Returns(Task.FromResult(Expectedrole));
            //mocking unit of work // not used here
            var unitOfWork = new Mock<IUnitOfWork>();
            // ENDED THE MOCKS


            var roleService = new RoleService(unitOfWork.Object, roleRepository.Object, roleMapper.Object);
            

            var result = await roleService.GetRoleByName(role.Id.Value);
            Assert.Null(result);

        }

    }




    

}




