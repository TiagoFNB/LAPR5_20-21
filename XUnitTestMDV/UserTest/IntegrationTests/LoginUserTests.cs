using DDDNetCore.Utils.Email;
using DDDNetCore.Utils.Jwt;
using DDDSample1.Controllers;
using DDDSample1.Domain.Roles;
using DDDSample1.Domain.Shared;
using DDDSample1.Domain.Users;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Xunit;

namespace XUnitTestMDV.UserTest.IntegrationTests
{
    public class LoginUserTests
    {

        [Fact]
        public async void ShouldLoginUser()
        {
            IPasswordHasher<User> passwordHasher = new PasswordHasher<User>();
            DateTime d = new DateTime(2002, 10, 18);
            LoginUserDto userdto = new LoginUserDto("email1@gmail.com", "password");
            User user = new User("name", "email1@gmail.com", "street", "city", "country", d);
            user.DefineHashedPassword(passwordHasher.HashPassword(user,userdto.Password));
            //mocking email sender
            var emailSender = new Mock<ISendEmail>();
           
            //mocking role repo
            var roleRepository = new Mock<IRoleRepository>();
           

            //mocking user repo
            var userRepo = new Mock<IUserRepository>();
            //var passwordHasher = new Mock<IPasswordHasher<User>>();
            //passwordHasher.Setup(o => o.VerifyHashedPassword(user.Id))
            //  .Returns(Task.FromResult(user));

            userRepo.Setup(o => o.GetByEmailAsync(user.Email.Email))
              .Returns(Task.FromResult(user));
            //mocking email
            var email = new Mock<ISendEmail>();
            email.Setup(o => o.sendEmail(null, null, null))
              .Returns(true);
            //mocking unit of work
            var unitOfWork = new Mock<IUnitOfWork>();

            JwtOptions jo = new JwtOptions();
            jo.JwtIssuer = "Issuer";
            jo.JwtExpireDays = 60;
            jo.JwtKey = "myKeyIsFAwSoMe16chars32bits";

            var userService = new UserService(unitOfWork.Object, userRepo.Object, new UserMapper(passwordHasher), roleRepository.Object, passwordHasher, new JwtProvider(jo),email.Object);

          

            LoginController cont = new LoginController(userService);

            var result = await cont.LoginAction(userdto);
            Assert.IsType<OkObjectResult>(result);
        }

        [Fact]
        public async void ShouldNotLoginUser() // Email is not found
        {

            IPasswordHasher<User> passwordHasher = new PasswordHasher<User>();
            DateTime d = new DateTime(2002, 10, 18);
            LoginUserDto userdto = new LoginUserDto("notfoundemail@gmail.com", "password");
            User user = new User("name", "email1@gmail.com", "street", "city", "country", d);
            user.DefineHashedPassword(passwordHasher.HashPassword(user, userdto.Password));
            //mocking email sender
            var emailSender = new Mock<ISendEmail>();

            //mocking role repo
            var roleRepository = new Mock<IRoleRepository>();


            //mocking user repo
            var userRepo = new Mock<IUserRepository>();
            //var passwordHasher = new Mock<IPasswordHasher<User>>();
            //passwordHasher.Setup(o => o.VerifyHashedPassword(user.Id))
            //  .Returns(Task.FromResult(user));
            User temp = null;
            userRepo.Setup(o => o.GetByEmailAsync(user.Email.Email))
              .Returns(Task.FromResult(temp));
            //mocking email
            var email = new Mock<ISendEmail>();
            email.Setup(o => o.sendEmail(null, null, null))
              .Returns(true);
            //mocking unit of work
            var unitOfWork = new Mock<IUnitOfWork>();

            JwtOptions jo = new JwtOptions();
            jo.JwtIssuer = "Issuer";
            jo.JwtExpireDays = 60;
            jo.JwtKey = "myKeyIsFAwSoMe16chars32bits";

            var userService = new UserService(unitOfWork.Object, userRepo.Object, new UserMapper(passwordHasher), roleRepository.Object, passwordHasher, new JwtProvider(jo),email.Object);



            LoginController cont = new LoginController(userService);

            var result = await cont.LoginAction(userdto);
           
            Assert.IsType<ContentResult>(result);
        }



        [Fact]
        public async void ShouldNotLoginUser2() // password dont match
        {
            IPasswordHasher<User> passwordHasher = new PasswordHasher<User>();
            DateTime d = new DateTime(2002, 10, 18);
            LoginUserDto userdto = new LoginUserDto("email1@gmail.com", "passwordDontMatch");
            User user = new User("name", "email1@gmail.com", "street", "city", "country", d);
            user.DefineHashedPassword(passwordHasher.HashPassword(user, "password"));
            //mocking email sender
            var emailSender = new Mock<ISendEmail>();

            //mocking role repo
            var roleRepository = new Mock<IRoleRepository>();


            //mocking user repo
            var userRepo = new Mock<IUserRepository>();
            //var passwordHasher = new Mock<IPasswordHasher<User>>();
            //passwordHasher.Setup(o => o.VerifyHashedPassword(user.Id))
            //  .Returns(Task.FromResult(user));

            userRepo.Setup(o => o.GetByEmailAsync(user.Email.Email))
              .Returns(Task.FromResult(user));
            //mocking email
            var email = new Mock<ISendEmail>();
            email.Setup(o => o.sendEmail(null, null, null))
              .Returns(true);
            //mocking unit of work
            var unitOfWork = new Mock<IUnitOfWork>();

            JwtOptions jo = new JwtOptions();
            jo.JwtIssuer = "Issuer";
            jo.JwtExpireDays = 60;
            jo.JwtKey = "myKeyIsFAwSoMe16chars32bits";

            var userService = new UserService(unitOfWork.Object, userRepo.Object, new UserMapper(passwordHasher), roleRepository.Object, passwordHasher, new JwtProvider(jo),email.Object);



            LoginController cont = new LoginController(userService);

            var result = await cont.LoginAction(userdto);
            Assert.IsType<ContentResult>(result);
        }
    }
}
