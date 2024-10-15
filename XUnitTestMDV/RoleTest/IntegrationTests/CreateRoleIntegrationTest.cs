using DDDSample1.Domain.Roles;
using DDDSample1.Domain.Shared;
using Microsoft.AspNetCore.Mvc;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Xunit;


namespace XUnitTestMDV.RoleTest.IntegrationTests
{
    public class CreateRoleIntegrationTest
    {
        [Fact]
        public async void ShouldCreateRole1()
        {
            //setup
            DDDSample1.Domain.Roles.CreateRoleDto roledto = new DDDSample1.Domain.Roles.CreateRoleDto("testcontroller");

            var role = new DDDSample1.Domain.Roles.Role("roleTestt");
            DDDSample1.Domain.Roles.Role temp = null;
            var roleRepository = new Mock<IRoleRepository>();
            roleRepository.Setup(o => o.AddAsync(role))
               .Returns(Task.FromResult(role));
            roleRepository.Setup(o => o.GetByIdAsync(role.Id))
               .Returns(Task.FromResult(temp));
            //mocking unit of work
            var unitOfWork = new Mock<IUnitOfWork>();
            unitOfWork.Setup(o => o.CommitAsync())
                .Returns(Task.FromResult(200));
            // finish setup


            var roleService = new RoleService(unitOfWork.Object, roleRepository.Object, new RoleMapper());



            DDDNetCore.Controllers.RoleController rc = new DDDNetCore.Controllers.RoleController(roleService);
            var result = await rc.Register(roledto);

            Assert.IsType<OkObjectResult>(result);


        }

        [Fact]
        public async void ShouldNotCreateRole1() // failes becouse of invalid name
        {
            //setup
            DDDSample1.Domain.Roles.CreateRoleDto roledto = new DDDSample1.Domain.Roles.CreateRoleDto("f");

            var role = new DDDSample1.Domain.Roles.Role("roleTestt");
            DDDSample1.Domain.Roles.Role temp = null;
            var roleRepository = new Mock<IRoleRepository>();
            roleRepository.Setup(o => o.AddAsync(role))
               .Returns(Task.FromResult(role));
            roleRepository.Setup(o => o.GetByIdAsync(role.Id))
               .Returns(Task.FromResult(temp));
            //mocking unit of work
            var unitOfWork = new Mock<IUnitOfWork>();
            unitOfWork.Setup(o => o.CommitAsync())
                .Returns(Task.FromResult(200));
            // finish setup


            var roleService = new RoleService(unitOfWork.Object, roleRepository.Object, new RoleMapper());



            DDDNetCore.Controllers.RoleController rc = new DDDNetCore.Controllers.RoleController(roleService);
            var result = await rc.Register(roledto);

            Assert.IsType<ContentResult>(result);  // when type is not OkObjectResult it means it failed


        }


        [Fact]
        public async void ShouldNotCreateRole2() // fails becouse there is already  a role with that name on the system
        {
            //setup
            DDDSample1.Domain.Roles.CreateRoleDto roledto = new DDDSample1.Domain.Roles.CreateRoleDto("roleTestt");

            var role = new DDDSample1.Domain.Roles.Role("roleTestt");
           
            var roleRepository = new Mock<IRoleRepository>();
            roleRepository.Setup(o => o.AddAsync(role))
              .Returns(Task.FromResult(role));
            roleRepository.Setup(o =>  o.GetByIdAsync(role.Id))
               .Returns(Task.FromResult(role));
            //mocking unit of work
            var unitOfWork = new Mock<IUnitOfWork>();
            unitOfWork.Setup(o => o.CommitAsync())
                .Returns(Task.FromResult(200));
            // finish setup


            var roleService = new RoleService(unitOfWork.Object, roleRepository.Object, new RoleMapper());



            DDDNetCore.Controllers.RoleController rc = new DDDNetCore.Controllers.RoleController(roleService);
            var result = await rc.Register(roledto);

            Assert.IsType<ContentResult>(result);


        }


       

    }
}
