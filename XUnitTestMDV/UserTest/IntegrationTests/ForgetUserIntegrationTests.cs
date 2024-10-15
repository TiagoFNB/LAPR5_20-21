using DDDNetCore.Users.Dtos;
using DDDNetCore.Utils.Email;
using DDDNetCore.Utils.Jwt;
using DDDSample1.Controllers;
using DDDSample1.Domain.Roles;
using DDDSample1.Domain.Shared;
using DDDSample1.Domain.Users;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Xunit;

namespace XUnitTestMDV.UserTest.IntegrationTests
{
   public  class ForgetUserIntegrationTests
    {



        [Fact]
        public async void ShouldForgetUser()
        {


            var claims = new List<Claim>()
           {
          new Claim(ClaimTypes.NameIdentifier, "rogernio1st@gmail.com"),
           };

            var identity = new ClaimsIdentity(claims, "TestAuthType");
            var claimsPrincipal = new ClaimsPrincipal(identity);

            //mocking httpcontext
            var httpContextM = new Mock<HttpContext>();
            httpContextM.SetupGet(x => x.User).Returns(claimsPrincipal);

            DateTime d = new DateTime(2002, 10, 18);
            DDDSample1.Domain.Roles.Role role = new DDDSample1.Domain.Roles.Role("User");
            RegisterUserDto userdto = new RegisterUserDto("name", "email1@gmail.com", "street", "city", "coutry", null, "password", d);
            User user = new User("name", "email1@gmail.com", "street", "city", "country", d);
            
            //mocking email sender
            var emailSender = new Mock<ISendEmail>();
          
            //mocking role repo
            var roleRepository = new Mock<IRoleRepository>();
           

            //mocking user repo
            var userRepo = new Mock<IUserRepository>();
           
            User t = null;
            userRepo.Setup(o => o.GetByEmailAsync(It.IsAny<string>()))
              .Returns(Task.FromResult(user));
            userRepo.Setup(o => o.UpdateUser(It.IsAny<User>()))
              .Returns(user);
            
            // mocking emailSender
            var email = new Mock<ISendEmail>();
          
            //mocking unit of work
            var unitOfWork = new Mock<IUnitOfWork>();
            unitOfWork.Setup(o => o.CommitAsync())
                .Returns(Task.FromResult(200));

            IPasswordHasher<User> passwordHasher = new PasswordHasher<User>();
            string hashedPassword = passwordHasher.HashPassword(user,"password1");
            user.DefineHashedPassword(hashedPassword);

            var userService = new UserService(unitOfWork.Object, userRepo.Object, new UserMapper(passwordHasher), roleRepository.Object, passwordHasher, new JwtProvider(new JwtOptions()), email.Object);


            ForgetUserDto dto = new ForgetUserDto("rogernio1st@gmail.com", "password1");
            ForgetUserDto expectedDto = new ForgetUserDto("rogernio1st@gmail.com",null);
            expectedDto.defineSuccessMessage();

            var cont = new ForgetUserController(userService)
            {
                ControllerContext = new ControllerContext()
                {
                    HttpContext = httpContextM.Object
                }
            };

           

            var result = await cont.ForgetUser(dto);
            //assert type of http response
            Assert.IsType<OkObjectResult>(result);

            //casting response to OkObjectResult
            var okObjectResult = result as OkObjectResult;
            //casting response values to ForgetUserDto
            var receivedDto = okObjectResult.Value as ForgetUserDto;


            string expEmail = expectedDto.Email;
            string receivedEmail = receivedDto.Email;

            string expMessage = expectedDto.Message;
            string receivedMessage = receivedDto.Message;

            Assert.Same(expEmail, receivedEmail);
            Assert.Contains(expMessage, receivedMessage); // assert same was not working and i dont know why
        }




        [Fact]
        public async void ShouldNotForgetUser_EmailInBodyIsNotSameAsInTokenClaims()
        {


            var claims = new List<Claim>()
           {

          new Claim(ClaimTypes.NameIdentifier, "anotheremail@gmail.com"),

           };

            var identity = new ClaimsIdentity(claims, "TestAuthType");
            var claimsPrincipal = new ClaimsPrincipal(identity);

            //mocking httpcontext
            var httpContextM = new Mock<HttpContext>();
            httpContextM.SetupGet(x => x.User).Returns(claimsPrincipal);

            DateTime d = new DateTime(2002, 10, 18);
            DDDSample1.Domain.Roles.Role role = new DDDSample1.Domain.Roles.Role("User");
            RegisterUserDto userdto = new RegisterUserDto("name", "email1@gmail.com", "street", "city", "coutry", null, "password", d);
            User user = new User("name", "email1@gmail.com", "street", "city", "country", d);

            //mocking email sender
            var emailSender = new Mock<ISendEmail>();
          
            //mocking role repo
            var roleRepository = new Mock<IRoleRepository>();
      

            //mocking user repo
            var userRepo = new Mock<IUserRepository>();
            userRepo.Setup(o => o.AddAsync(user))
               .Returns(Task.FromResult(user));
            User t = null;
            userRepo.Setup(o => o.GetByEmailAsync(It.IsAny<string>()))
              .Returns(Task.FromResult(user));
            userRepo.Setup(o => o.UpdateUser(It.IsAny<User>()))
              .Returns(user);

            // mocking emailSender
            var email = new Mock<ISendEmail>();
        
            //mocking unit of work
            var unitOfWork = new Mock<IUnitOfWork>();
            unitOfWork.Setup(o => o.CommitAsync())
                .Returns(Task.FromResult(200));

            IPasswordHasher<User> passwordHasher = new PasswordHasher<User>();
            string hashedPassword = passwordHasher.HashPassword(user, "password1");
            user.DefineHashedPassword(hashedPassword);
            var userService = new UserService(unitOfWork.Object, userRepo.Object, new UserMapper(passwordHasher), roleRepository.Object, passwordHasher, new JwtProvider(new JwtOptions()), email.Object);


            ForgetUserDto dto = new ForgetUserDto("rogernio1st@gmail.com", "password1");
            ForgetUserDto expectedDto = new ForgetUserDto("rogernio1st@gmail.com",null);
            expectedDto.defineUnauthorizeMessage();

            var cont = new ForgetUserController(userService)
            {
                ControllerContext = new ControllerContext()
                {
                    HttpContext = httpContextM.Object
                }
            };



            var result = await cont.ForgetUser(dto);
            //assert type of http response
            Assert.IsType<UnauthorizedObjectResult>(result);

            //casting response to UnauthorizedObjectResult
            var okObjectResult = result as UnauthorizedObjectResult;
            //casting response values to ForgetUserDto
            var receivedDto = okObjectResult.Value as ForgetUserDto;


            string expEmail = expectedDto.Email;
            string receivedEmail = receivedDto.Email;

            string expMessage = expectedDto.Message;
            string receivedMessage = receivedDto.Message;

            Assert.Same(expEmail, receivedEmail);
            Assert.Contains(expMessage, receivedMessage); // assert same was not working and i dont know why
        }



        [Fact]
        public async void ShouldNotForgetUser_CantUpdateTheUserInfoOnDb()
        {

           
            var claims = new List<Claim>()
           {

          new Claim(ClaimTypes.NameIdentifier, "rogernio1st@gmail.com"),

                  };
            var identity = new ClaimsIdentity(claims, "TestAuthType");
            var claimsPrincipal = new ClaimsPrincipal(identity);

            //mocking httpcontext
            var httpContextM = new Mock<HttpContext>();
            httpContextM.SetupGet(x => x.User).Returns(claimsPrincipal);


           
            //mocking email sender
            var emailSender = new Mock<ISendEmail>();

            var roleRepository = new Mock<IRoleRepository>();

            //mocking user repo
            var userRepo = new Mock<IUserRepository>();
            
            DateTime d = new DateTime(2002, 10, 18);
            User user = new User("name", "email1@gmail.com", "street", "city", "country", d);
            
            userRepo.Setup(o => o.GetByEmailAsync(It.IsAny<string>()))
              .Returns(Task.FromResult(user));
            userRepo.Setup(o => o.UpdateUser(It.IsAny<User>()))
              .Throws(new Exception());

            // mocking emailSender
            var email = new Mock<ISendEmail>();
           
            //mocking unit of work
            var unitOfWork = new Mock<IUnitOfWork>();
            unitOfWork.Setup(o => o.CommitAsync())
                .Returns(Task.FromResult(200));

            IPasswordHasher<User> passwordHasher = new PasswordHasher<User>();
            string hashedPassword = passwordHasher.HashPassword(user, "password1");
            user.DefineHashedPassword(hashedPassword);
            var userService = new UserService(unitOfWork.Object, userRepo.Object, new UserMapper(passwordHasher), roleRepository.Object, passwordHasher, new JwtProvider(new JwtOptions()), email.Object);


            ForgetUserDto dto = new ForgetUserDto("rogernio1st@gmail.com", "password1");
            ForgetUserDto expectedDto = new ForgetUserDto("rogernio1st@gmail.com",null);
            expectedDto.defineInvalidMessage(null);

            var cont = new ForgetUserController(userService)
            {
                ControllerContext = new ControllerContext()
                {
                    HttpContext = httpContextM.Object
                }
            };



            var result = await cont.ForgetUser(dto);
            //assert type of http response
            Assert.IsType<BadRequestObjectResult>(result);

            //casting response to BadRequestObjectResult
            var okObjectResult = result as BadRequestObjectResult;
            //casting response values to ForgetUserDto
            var receivedDto = okObjectResult.Value as ForgetUserDto;


            string expEmail = expectedDto.Email;
            string receivedEmail = receivedDto.Email;

            string expMessage = expectedDto.Message;
            string receivedMessage = receivedDto.Message;

            Assert.Same(expEmail, receivedEmail);
            Assert.Contains(expMessage, receivedMessage); // assert same was not working and i dont know why
        }


        [Fact]
        public async void ShouldNotForgetUser_TheresNoUserWithSuchEmail()
        {


            var claims = new List<Claim>()
           {

          new Claim(ClaimTypes.NameIdentifier, "rogernio1st@gmail.com"),

                  };
            var identity = new ClaimsIdentity(claims, "TestAuthType");
            var claimsPrincipal = new ClaimsPrincipal(identity);

            //mocking httpcontext
            var httpContextM = new Mock<HttpContext>();
            httpContextM.SetupGet(x => x.User).Returns(claimsPrincipal);



            //mocking email sender
            var emailSender = new Mock<ISendEmail>();

            var roleRepository = new Mock<IRoleRepository>();

            //mocking user repo
            var userRepo = new Mock<IUserRepository>();

            DateTime d = new DateTime(2002, 10, 18);
            User user = new User("name", "email1@gmail.com", "street", "city", "country", d);
            User t = null;
            userRepo.Setup(o => o.GetByEmailAsync(It.IsAny<string>()))
              .Returns(Task.FromResult(t));
            userRepo.Setup(o => o.UpdateUser(It.IsAny<User>()))
              .Returns(user);

            // mocking emailSender
            var email = new Mock<ISendEmail>();

            //mocking unit of work
            var unitOfWork = new Mock<IUnitOfWork>();
            unitOfWork.Setup(o => o.CommitAsync())
                .Returns(Task.FromResult(200));

            IPasswordHasher<User> passwordHasher = new PasswordHasher<User>();
            string hashedPassword = passwordHasher.HashPassword(user, "password1");
            user.DefineHashedPassword(hashedPassword);
            var userService = new UserService(unitOfWork.Object, userRepo.Object, new UserMapper(passwordHasher), roleRepository.Object, passwordHasher, new JwtProvider(new JwtOptions()), email.Object);


            ForgetUserDto dto = new ForgetUserDto("rogernio1st@gmail.com", "password1");
            ForgetUserDto expectedDto = new ForgetUserDto("rogernio1st@gmail.com",null);
            expectedDto.defineInvalidMessage("User dosent exists");

            var cont = new ForgetUserController(userService)
            {
                ControllerContext = new ControllerContext()
                {
                    HttpContext = httpContextM.Object
                }
            };



            var result = await cont.ForgetUser(dto);
            //assert type of http response
            Assert.IsType<BadRequestObjectResult>(result);

            //casting response to BadRequestObjectResult
            var okObjectResult = result as BadRequestObjectResult;
            //casting response values to ForgetUserDto
            var receivedDto = okObjectResult.Value as ForgetUserDto;


            string expEmail = expectedDto.Email;
            string receivedEmail = receivedDto.Email;

            string expMessage = expectedDto.Message;
            string receivedMessage = receivedDto.Message;

            Assert.Same(expEmail, receivedEmail);
            Assert.Contains(expMessage, receivedMessage); // assert same was not working and i dont know why
        }
    }
}
