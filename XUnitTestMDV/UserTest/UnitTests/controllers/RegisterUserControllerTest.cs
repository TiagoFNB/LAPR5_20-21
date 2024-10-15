using DDDNetCore.Utils.Email;
using DDDSample1.Controllers;
using DDDSample1.Domain.Users;
using Microsoft.AspNetCore.Mvc;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Xunit;
namespace XUnitTestMDV.UserTest.UnitTests.controllers
{
   public class RegisterUserControllerTest
    {
        [Fact]
        public async void ShouldCreateUser()
        {
            DateTime d = new DateTime(2002, 10, 18);
            
            RegisterUserDto userdto = new RegisterUserDto("name", "email1@gmail.com", "street", "city","coutry",null,"password", d);
            User user = new User("name", "email1@gmail.com", "street", "city", "country", d);
            var userService = new Mock<IUserService>();
            userService.Setup(o => o.AddAsync(userdto))
              .Returns(Task.FromResult(userdto));

            var emailSender = new Mock<ISendEmail>();
            emailSender.Setup(o => o.sendEmail("receiver","subject","body"))
               .Returns(true);


            RegisterUserController rc = new RegisterUserController(userService.Object, emailSender.Object);
            var result = await rc.Register(userdto);
            Assert.IsType<OkObjectResult>(result);
            ////var status = result;

            ////var code = status.GetType();
            ////Assert.Equal("OkObjectResult", code.Name);
            //Assert.IsType<OkObjectResult>(result);
        }


        [Fact]
        public async void ShouldCreateUser2() // even if the email with the information of user password is not sent, the user is created
        {
            DateTime d = new DateTime(2002, 10, 18);

            RegisterUserDto userdto = new RegisterUserDto("name", "email1@gmail.com", "street", "city", "coutry", null, "password", d);
            User user = new User("name", "email1@gmail.com", "street", "city", "country", d);
            var userService = new Mock<IUserService>();
            userService.Setup(o => o.AddAsync(userdto))
              .Returns(Task.FromResult(userdto));

            var emailSender = new Mock<ISendEmail>();
            emailSender.Setup(o => o.sendEmail("receiver", "subject", "body"))
               .Returns(false);


            RegisterUserController rc = new RegisterUserController(userService.Object, emailSender.Object);
            var result = await rc.Register(userdto);
            Assert.IsType<OkObjectResult>(result);
            ////var status = result;

            ////var code = status.GetType();
            ////Assert.Equal("OkObjectResult", code.Name);
            //Assert.IsType<OkObjectResult>(result);
        }



        [Fact]
        public async void ShouldNotCreateUser1() // service fails to register the user
        {
            DateTime d = new DateTime(2002, 10, 18);

            RegisterUserDto userdto = new RegisterUserDto("name", "email1@gmail.com", "street", "city", "coutry", null, "password", d);
            User user = new User("name", "email1@gmail.com", "street", "city", "country", d);
            var userService = new Mock<IUserService>();
            userService.Setup(o => o.AddAsync(userdto))
              .Throws(new Exception());

            var emailSender = new Mock<ISendEmail>();
            emailSender.Setup(o => o.sendEmail("receiver", "subject", "body"))
               .Returns(true);


            RegisterUserController rc = new RegisterUserController(userService.Object, emailSender.Object);
            var result = await rc.Register(userdto);
            Assert.IsType<ContentResult>(result); // if the type of response ContentResult then we know it failed to create user
            ////var status = result;

            ////var code = status.GetType();
            ////Assert.Equal("OkObjectResult", code.Name);
            //Assert.IsType<OkObjectResult>(result);
        }


       


    }
}
