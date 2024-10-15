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
    public class RegisterUserTest
    {



        [Fact]
        public async void ShouldCreateUser()
        {
            DateTime d = new DateTime(2002, 10, 18);
            DDDSample1.Domain.Roles.Role role = new DDDSample1.Domain.Roles.Role("User");
            RegisterUserDto userdto = new RegisterUserDto("name", "email1@gmail.com", "street", "city", "coutry", null, "password", d);
            User user = new User("name", "email1@gmail.com", "street", "city", "country", d);

            //mocking email sender
            var emailSender = new Mock<ISendEmail>();
            emailSender.Setup(o => o.sendEmail("receiver", "subject", "body"))
               .Returns(true);
            //mocking role repo
            var roleRepository = new Mock<IRoleRepository>();
            roleRepository.Setup(o => o.GetByIdAsync(role.Id))
               .Returns(Task.FromResult(role));

            //mocking user repo
            var userRepo = new Mock<IUserRepository>();
            userRepo.Setup(o => o.AddAsync(user))
               .Returns(Task.FromResult(user));
            User t = null;
            userRepo.Setup(o => o.GetByEmailAsync(user.Email.Email))
              .Returns(Task.FromResult(t));
           // mocking emailSender
            var email = new Mock<ISendEmail>();
            email.Setup(o => o.sendEmail(null, null,null))
              .Returns(true);
            //mocking unit of work
            var unitOfWork = new Mock<IUnitOfWork>();
            unitOfWork.Setup(o => o.CommitAsync())
                .Returns(Task.FromResult(200));

            IPasswordHasher<User> passwordHasher  = new PasswordHasher<User>();

            var userService = new UserService(unitOfWork.Object, userRepo.Object, new UserMapper(passwordHasher), roleRepository.Object, passwordHasher, new JwtProvider(new JwtOptions()), email.Object);

            var x = await userService.AddAsync(userdto);




            Assert.Equal(userdto.City, x.City);
            Assert.Null(x.Password ); // the dto that comes out dont have the password
            Assert.Equal(userdto.Country, x.Country);
            Assert.Equal(userdto.Street, x.Street);
            Assert.Equal(userdto.Name, x.Name);
            Assert.Equal(userdto.Email, x.Email);
            Assert.Equal(userdto.DateOfBirth, x.DateOfBirth);
            // becouse this test was a bit complex in terms of mocking i first makes sure service is working and so, controller must/should work
           //testing controller

            RegisterUserController cont = new RegisterUserController(userService, new SendEmail());

            var result = await cont.Register(userdto);
            Assert.IsType<OkObjectResult>(result);
        }


        [Fact]
        public async void ShouldNotCreateUser1() // email in dto is invalid
        {
            DateTime d = new DateTime(2002, 10, 18);
            DDDSample1.Domain.Roles.Role role = new DDDSample1.Domain.Roles.Role("User");
            RegisterUserDto userdto = new RegisterUserDto("name", "email1", "street", "city", "coutry", null, "password", d);
            User user = new User("name", "email1@gmail.com", "street", "city", "country", d);

            //mocking email sender
            var emailSender = new Mock<ISendEmail>();
            emailSender.Setup(o => o.sendEmail("receiver", "subject", "body"))
               .Returns(true);
            //mocking role repo
            var roleRepository = new Mock<IRoleRepository>();
            roleRepository.Setup(o => o.GetByIdAsync(role.Id))
               .Returns(Task.FromResult(role));

            //mocking user repo
            var userRepo = new Mock<IUserRepository>();
            userRepo.Setup(o => o.AddAsync(user))
               .Returns(Task.FromResult(user));
            User t = null;
            userRepo.Setup(o => o.GetByEmailAsync(user.Email.Email))
              .Returns(Task.FromResult(t));
            var email = new Mock<ISendEmail>();
            email.Setup(o => o.sendEmail(null, null, null))
              .Returns(true);
            //mocking unit of work
            var unitOfWork = new Mock<IUnitOfWork>();
            unitOfWork.Setup(o => o.CommitAsync())
                .Returns(Task.FromResult(200));

            IPasswordHasher<User> passwordHasher = new PasswordHasher<User>();

            var userService = new UserService(unitOfWork.Object, userRepo.Object, new UserMapper(passwordHasher), roleRepository.Object, passwordHasher, new JwtProvider(new JwtOptions()),email.Object);

            

            RegisterUserController cont = new RegisterUserController(userService, new SendEmail());

            var result = await cont.Register(userdto);

            // service throws an error so the context type is ContentResult instead of OkObjectResult
            Assert.IsType<ContentResult>(result);





        }



        [Fact]
        public async void ShouldNotCreateUser2() // name in dto is invalid
        {
            DateTime d = new DateTime(2002, 10, 18);
            DDDSample1.Domain.Roles.Role role = new DDDSample1.Domain.Roles.Role("User");
            RegisterUserDto userdto = new RegisterUserDto("", "email1@gmail.com", "street", "city", "coutry", null, "password", d);
            User user = new User("name", "email1@gmail.com", "street", "city", "country", d);

            //mocking email sender
            var emailSender = new Mock<ISendEmail>();
            emailSender.Setup(o => o.sendEmail("receiver", "subject", "body"))
               .Returns(true);
            //mocking role repo
            var roleRepository = new Mock<IRoleRepository>();
            roleRepository.Setup(o => o.GetByIdAsync(role.Id))
               .Returns(Task.FromResult(role));

            //mocking user repo
            var userRepo = new Mock<IUserRepository>();
            userRepo.Setup(o => o.AddAsync(user))
               .Returns(Task.FromResult(user));
            User t = null;
            userRepo.Setup(o => o.GetByEmailAsync(user.Email.Email))
              .Returns(Task.FromResult(t));
            //mocking email
            var email = new Mock<ISendEmail>();
            email.Setup(o => o.sendEmail(null, null, null))
              .Returns(true);
            //mocking unit of work
            var unitOfWork = new Mock<IUnitOfWork>();
            unitOfWork.Setup(o => o.CommitAsync())
                .Returns(Task.FromResult(200));

            IPasswordHasher<User> passwordHasher = new PasswordHasher<User>();

            var userService = new UserService(unitOfWork.Object, userRepo.Object, new UserMapper(passwordHasher), roleRepository.Object, passwordHasher, new JwtProvider(new JwtOptions()), email.Object);



            RegisterUserController cont = new RegisterUserController(userService, new SendEmail());

            var result = await cont.Register(userdto);

            // service throws an error so the context type is ContentResult instead of OkObjectResult
            Assert.IsType<ContentResult>(result);





        }


        [Fact]
        public async void ShouldNotCreateUser3() // password in dto is invalid
        {
            DateTime d = new DateTime(2002, 10, 18);
            DDDSample1.Domain.Roles.Role role = new DDDSample1.Domain.Roles.Role("User");
            RegisterUserDto userdto = new RegisterUserDto("name", "email1@gmail.com", "street", "city", "coutry", null, "p", d);
            User user = new User("name", "email1@gmail.com", "street", "city", "country", d);

            //mocking email sender
            var emailSender = new Mock<ISendEmail>();
            emailSender.Setup(o => o.sendEmail("receiver", "subject", "body"))
               .Returns(true);
            //mocking role repo
            var roleRepository = new Mock<IRoleRepository>();
            roleRepository.Setup(o => o.GetByIdAsync(role.Id))
               .Returns(Task.FromResult(role));

            //mocking user repo
            var userRepo = new Mock<IUserRepository>();
            userRepo.Setup(o => o.AddAsync(user))
               .Returns(Task.FromResult(user));
            User t = null;
            userRepo.Setup(o => o.GetByEmailAsync(user.Email.Email))
              .Returns(Task.FromResult(t));
            //mockigne mail
            var email = new Mock<ISendEmail>();
            email.Setup(o => o.sendEmail(null, null, null))
              .Returns(true);
            //mocking unit of work
            var unitOfWork = new Mock<IUnitOfWork>();
            unitOfWork.Setup(o => o.CommitAsync())
                .Returns(Task.FromResult(200));

            IPasswordHasher<User> passwordHasher = new PasswordHasher<User>();

            var userService = new UserService(unitOfWork.Object, userRepo.Object, new UserMapper(passwordHasher), roleRepository.Object, passwordHasher, new JwtProvider(new JwtOptions()), email.Object);



            RegisterUserController cont = new RegisterUserController(userService, new SendEmail());

            var result = await cont.Register(userdto);

            // service throws an error so the context type is ContentResult instead of OkObjectResult
            Assert.IsType<ContentResult>(result);





        }

        [Fact]
        public async void ShouldNotCreateUser4() // city in dto is invalid
        {
            DateTime d = new DateTime(2002, 10, 18);
            DDDSample1.Domain.Roles.Role role = new DDDSample1.Domain.Roles.Role("User");
            RegisterUserDto userdto = new RegisterUserDto("name", "email1@gmail.com", "street", "c", "coutry", null, "password", d);
            User user = new User("name", "email1@gmail.com", "street", "city", "country", d);

            //mocking email sender
            var emailSender = new Mock<ISendEmail>();
            emailSender.Setup(o => o.sendEmail("receiver", "subject", "body"))
               .Returns(true);
            //mocking role repo
            var roleRepository = new Mock<IRoleRepository>();
            roleRepository.Setup(o => o.GetByIdAsync(role.Id))
               .Returns(Task.FromResult(role));

            //mocking user repo
            var userRepo = new Mock<IUserRepository>();
            userRepo.Setup(o => o.AddAsync(user))
               .Returns(Task.FromResult(user));
            User t = null;
            userRepo.Setup(o => o.GetByEmailAsync(user.Email.Email))
              .Returns(Task.FromResult(t));
            var email = new Mock<ISendEmail>();
            email.Setup(o => o.sendEmail(null, null, null))
              .Returns(true);
            //mocking unit of work
            var unitOfWork = new Mock<IUnitOfWork>();
            unitOfWork.Setup(o => o.CommitAsync())
                .Returns(Task.FromResult(200));

            IPasswordHasher<User> passwordHasher = new PasswordHasher<User>();

            var userService = new UserService(unitOfWork.Object, userRepo.Object, new UserMapper(passwordHasher), roleRepository.Object, passwordHasher, new JwtProvider(new JwtOptions()), email.Object);



            RegisterUserController cont = new RegisterUserController(userService, new SendEmail());

            var result = await cont.Register(userdto);

            // service throws an error so the context type is ContentResult instead of OkObjectResult
            Assert.IsType<ContentResult>(result);





        }
        [Fact]
        public async void ShouldNotCreateUser5() // street in dto is invalid
        {
            DateTime d = new DateTime(2002, 10, 18);
            DDDSample1.Domain.Roles.Role role = new DDDSample1.Domain.Roles.Role("User");
            RegisterUserDto userdto = new RegisterUserDto("name", "email1@gmail.com", "s", "city", "coutry", null, "password", d);
            User user = new User("name", "email1@gmail.com", "street", "city", "country", d);

            //mocking email sender
            var emailSender = new Mock<ISendEmail>();
            emailSender.Setup(o => o.sendEmail("receiver", "subject", "body"))
               .Returns(true);
            //mocking role repo
            var roleRepository = new Mock<IRoleRepository>();
            roleRepository.Setup(o => o.GetByIdAsync(role.Id))
               .Returns(Task.FromResult(role));

            //mocking user repo
            var userRepo = new Mock<IUserRepository>();
            userRepo.Setup(o => o.AddAsync(user))
               .Returns(Task.FromResult(user));
            User t = null;
            userRepo.Setup(o => o.GetByEmailAsync(user.Email.Email))
              .Returns(Task.FromResult(t));
            //mocking email
            var email = new Mock<ISendEmail>();
            email.Setup(o => o.sendEmail(null, null, null))
              .Returns(true);
            //mocking unit of work
            var unitOfWork = new Mock<IUnitOfWork>();
            unitOfWork.Setup(o => o.CommitAsync())
                .Returns(Task.FromResult(200));

            IPasswordHasher<User> passwordHasher = new PasswordHasher<User>();

            var userService = new UserService(unitOfWork.Object, userRepo.Object, new UserMapper(passwordHasher), roleRepository.Object, passwordHasher, new JwtProvider(new JwtOptions()), email.Object);



            RegisterUserController cont = new RegisterUserController(userService, new SendEmail());

            var result = await cont.Register(userdto);

            // service throws an error so the context type is ContentResult instead of OkObjectResult
            Assert.IsType<ContentResult>(result);





        }
        [Fact]
        public async void ShouldNotCreateUser6() // country in dto is invalid
        {
            DateTime d = new DateTime(2002, 10, 18);
            DDDSample1.Domain.Roles.Role role = new DDDSample1.Domain.Roles.Role("User");
            RegisterUserDto userdto = new RegisterUserDto("name", "email1@gmail.com", "street", "city", "c", null, "password", d);
            User user = new User("name", "email1@gmail.com", "street", "city", "country", d);

            //mocking email sender
            var emailSender = new Mock<ISendEmail>();
            emailSender.Setup(o => o.sendEmail("receiver", "subject", "body"))
               .Returns(true);
            //mocking role repo
            var roleRepository = new Mock<IRoleRepository>();
            roleRepository.Setup(o => o.GetByIdAsync(role.Id))
               .Returns(Task.FromResult(role));

            //mocking user repo
            var userRepo = new Mock<IUserRepository>();
            userRepo.Setup(o => o.AddAsync(user))
               .Returns(Task.FromResult(user));
            User t = null;
            userRepo.Setup(o => o.GetByEmailAsync(user.Email.Email))
              .Returns(Task.FromResult(t));
            //mocking email
            var email = new Mock<ISendEmail>();
            email.Setup(o => o.sendEmail(null, null, null))
              .Returns(true);
            //mocking unit of work
            var unitOfWork = new Mock<IUnitOfWork>();
            unitOfWork.Setup(o => o.CommitAsync())
                .Returns(Task.FromResult(200));

            IPasswordHasher<User> passwordHasher = new PasswordHasher<User>();

            var userService = new UserService(unitOfWork.Object, userRepo.Object, new UserMapper(passwordHasher), roleRepository.Object, passwordHasher, new JwtProvider(new JwtOptions()), email.Object);



            RegisterUserController cont = new RegisterUserController(userService, new SendEmail());

            var result = await cont.Register(userdto);

            // service throws an error so the context type is ContentResult instead of OkObjectResult
            Assert.IsType<ContentResult>(result);





        }
        [Fact]
        public async void ShouldNotCreateUser7() // role dont exists ( role is set automaticly to User on registration but i do a check if it exists
        {
            DateTime d = new DateTime(2002, 10, 18);
            DDDSample1.Domain.Roles.Role role = new DDDSample1.Domain.Roles.Role("User");
            RegisterUserDto userdto = new RegisterUserDto("name", "email1@gmail.com", "street", "city", "city", null, "password", d);
            User user = new User("name", "email1@gmail.com", "street", "city", "country", d);

            //mocking email sender
            var emailSender = new Mock<ISendEmail>();
            emailSender.Setup(o => o.sendEmail("receiver", "subject", "body"))
               .Returns(true);
            //mocking role repo
            DDDSample1.Domain.Roles.Role r = null;
            var roleRepository = new Mock<IRoleRepository>();
            roleRepository.Setup(o => o.GetByIdAsync(role.Id))
               .Returns(Task.FromResult(r));

            //mocking user repo
            var userRepo = new Mock<IUserRepository>();
            userRepo.Setup(o => o.AddAsync(user))
               .Returns(Task.FromResult(user));
            User t = null;
            userRepo.Setup(o => o.GetByEmailAsync(user.Email.Email))
              .Returns(Task.FromResult(t));
            //mocking email
            var email = new Mock<ISendEmail>();
            email.Setup(o => o.sendEmail(null, null, null))
              .Returns(true);
            //mocking unit of work
            var unitOfWork = new Mock<IUnitOfWork>();
            unitOfWork.Setup(o => o.CommitAsync())
                .Returns(Task.FromResult(200));

            IPasswordHasher<User> passwordHasher = new PasswordHasher<User>();

            var userService = new UserService(unitOfWork.Object, userRepo.Object, new UserMapper(passwordHasher), roleRepository.Object, passwordHasher, new JwtProvider(new JwtOptions()), email.Object);



            RegisterUserController cont = new RegisterUserController(userService, new SendEmail());

            var result = await cont.Register(userdto);

            // service throws an error so the context type is ContentResult instead of OkObjectResult
            Assert.IsType<ContentResult>(result);





        }

        [Fact]
        public async void ShouldNotCreateUser8() // user with same email already exists
        {
            DateTime d = new DateTime(2002, 10, 18);
            DDDSample1.Domain.Roles.Role role = new DDDSample1.Domain.Roles.Role("User");
            RegisterUserDto userdto = new RegisterUserDto("name", "email1@gmail.com", "street", "city", "city", null, "password", d);
            User user = new User("name", "email1@gmail.com", "street", "city", "country", d);

            //mocking email sender
            var emailSender = new Mock<ISendEmail>();
            emailSender.Setup(o => o.sendEmail("receiver", "subject", "body"))
               .Returns(true);
            //mocking role repo
            var roleRepository = new Mock<IRoleRepository>();
            roleRepository.Setup(o => o.GetByIdAsync(role.Id))
               .Returns(Task.FromResult(role));

            //mocking user repo
            var userRepo = new Mock<IUserRepository>();
            userRepo.Setup(o => o.AddAsync(user))
               .Returns(Task.FromResult(user));
            //User t = null;
            userRepo.Setup(o => o.GetByEmailAsync(user.Email.Email))
              .Returns(Task.FromResult(user));
            //mocking email
            var email = new Mock<ISendEmail>();
            email.Setup(o => o.sendEmail(null, null, null))
              .Returns(true);
            //mocking unit of work
            var unitOfWork = new Mock<IUnitOfWork>();
            unitOfWork.Setup(o => o.CommitAsync())
                .Returns(Task.FromResult(200));

            IPasswordHasher<User> passwordHasher = new PasswordHasher<User>();

            var userService = new UserService(unitOfWork.Object, userRepo.Object, new UserMapper(passwordHasher), roleRepository.Object, passwordHasher, new JwtProvider(new JwtOptions()), email.Object);



            RegisterUserController cont = new RegisterUserController(userService, new SendEmail());

            var result = await cont.Register(userdto);

            // service throws an error so the context type is ContentResult instead of OkObjectResult
            Assert.IsType<ContentResult>(result);





        }
    }
}
