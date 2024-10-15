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
namespace XUnitTestMDV.Role.Controller
{
    public class RoleControllerTest
    {

        [Fact]
        public async void ShouldCreateRole1()
        {
            DDDSample1.Domain.Roles.CreateRoleDto roledto = new DDDSample1.Domain.Roles.CreateRoleDto("testcontroller");
            DDDSample1.Domain.Roles.Role role = new DDDSample1.Domain.Roles.Role("testcontroller");
            var roleService = new Mock<DDDSample1.Domain.Roles.IRoleService>();
            roleService.Setup(o => o.AddAsync(roledto))
              .Returns(Task.FromResult(roledto));
            



           
            DDDNetCore.Controllers.RoleController rc = new DDDNetCore.Controllers.RoleController(roleService.Object);
            var result = await rc.Register(roledto);
            //var status = result;

            //var code = status.GetType();
            //Assert.Equal("OkObjectResult", code.Name);
            Assert.IsType<OkObjectResult>(result);
        }


        [Fact]
        public async void ShouldNotCreateRole1() // failed AddAsync of service
        {
            DDDSample1.Domain.Roles.CreateRoleDto roledto = new DDDSample1.Domain.Roles.CreateRoleDto("testcontroller");
            DDDSample1.Domain.Roles.Role role = new DDDSample1.Domain.Roles.Role("testcontroller");
            var roleService = new Mock<DDDSample1.Domain.Roles.IRoleService>();
            roleService.Setup(o => o.AddAsync(roledto))
             .Throws(new Exception());




         
            DDDNetCore.Controllers.RoleController rc = new DDDNetCore.Controllers.RoleController(roleService.Object);
            var result = await rc.Register(roledto);
            //var status = result;

            //  var code = status.GetType();
            //Assert.NotEqual("OkObjectResult", code.Name);
             Assert.IsType<ContentResult>(result);

        }





    }






}




