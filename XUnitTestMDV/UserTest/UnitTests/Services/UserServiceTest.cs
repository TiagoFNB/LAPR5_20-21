using DDDNetCore.Users.Dtos;
using DDDNetCore.Utils.Email;
using DDDNetCore.Utils.Jwt;
using DDDSample1.Domain.Roles;
using DDDSample1.Domain.Shared;
using DDDSample1.Domain.Users;
using Microsoft.AspNetCore.Identity;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Xunit;

namespace XUnitTestMDV.UserTest.UnitTests.Services
{
   public class UserServiceTest
    {
        [Fact]
        public async void ShouldRegisterUser1()
        {
            DateTime d = new DateTime(2002, 10, 18);
            // START THE MOCKS
            DDDSample1.Domain.Roles.Role role = new DDDSample1.Domain.Roles.Role("User");
            User user = new User("name1", "email1@gmail.com", "street", "city", "country", d);
            RegisterUserDto userDto = new RegisterUserDto("name1", "email1@gmail.com", "street", "city", "country",null,"password", d);

            var userMapper = new Mock<IUserMapper>();
            userMapper.Setup(o => o.MapFromRegisterUserDtoToDomain(userDto))
              .Returns(user);
            userMapper.Setup(o => o.MapFromDomain2Dto(user))
            .Returns(userDto);

            var roleRepository = new Mock<IRoleRepository>();
            roleRepository.Setup(o => o.GetByIdAsync(user.RoleName))
               .Returns(Task.FromResult(role));
            var userRepository = new Mock<IUserRepository>();
            userRepository.Setup(o => o.AddAsync(user))
               .Returns(Task.FromResult(user));
             userRepository = new Mock<IUserRepository>();

            User temp = null;
            userRepository.Setup(o => o.GetByEmailAsync(user.Email.Email))
               .Returns(Task.FromResult(temp));

            var jwtMock = new Mock<IJwtProvider>();

            var hasher = new Mock<IPasswordHasher<User>>();

            var email = new Mock<ISendEmail>();
            email.Setup(o => o.sendEmail(null, null, null))
              .Returns(true);

            //mocking unit of work
            var unitOfWork = new Mock<IUnitOfWork>();
            unitOfWork.Setup(o => o.CommitAsync())
                .Returns(Task.FromResult(200));


            var userService = new UserService(unitOfWork.Object, userRepository.Object, userMapper.Object, roleRepository.Object, hasher.Object, jwtMock.Object, email.Object);
            // ENDED THE MOCKS

            var result = await userService.AddAsync(userDto);

            Assert.Equal(result.Name, userDto.Name);
            Assert.Equal(result.Email, userDto.Email);
            Assert.Equal(result.City, userDto.City);
            Assert.Equal(result.Street, userDto.Street);
            Assert.Equal(result.Country, userDto.Country);
            Assert.Equal(result.DateOfBirth.Date, userDto.DateOfBirth);
            
        }


        [Fact]
        public async void ShouldNotRegisterUser1() //theres no role that fits the user
        {
            DateTime d = new DateTime(2002, 10, 18);
            // START THE MOCKS
            DDDSample1.Domain.Roles.Role role = new DDDSample1.Domain.Roles.Role("User");
            User user = new User("name1", "email1@gmail.com", "street", "city", "country", d);
            RegisterUserDto userDto = new RegisterUserDto("name1", "email1@gmail.com", "street", "city", "country", null, "password", d);

            var userMapper = new Mock<IUserMapper>();
            userMapper.Setup(o => o.MapFromRegisterUserDtoToDomain(userDto))
              .Returns(user);
            userMapper.Setup(o => o.MapFromDomain2Dto(user))
            .Returns(userDto);

            var roleRepository = new Mock<IRoleRepository>();
            DDDSample1.Domain.Roles.Role rtemp = null;
            roleRepository.Setup(o => o.GetByIdAsync(user.RoleName))
               .Returns(Task.FromResult(rtemp));
            var userRepository = new Mock<IUserRepository>();
            userRepository.Setup(o => o.AddAsync(user))
               .Returns(Task.FromResult(user));
            userRepository = new Mock<IUserRepository>();

            User temp = null;
            userRepository.Setup(o => o.GetByEmailAsync(user.Email.Email))
               .Returns(Task.FromResult(temp));

            var jwtMock = new Mock<IJwtProvider>();

            var hasher = new Mock<IPasswordHasher<User>>();

            var email = new Mock<ISendEmail>();
            email.Setup(o => o.sendEmail(null, null, null))
              .Returns(true);
            //mocking unit of work
            var unitOfWork = new Mock<IUnitOfWork>();
            unitOfWork.Setup(o => o.CommitAsync())
                .Returns(Task.FromResult(200));


            var userService = new UserService(unitOfWork.Object, userRepository.Object, userMapper.Object, roleRepository.Object, hasher.Object, jwtMock.Object,email.Object);
            // ENDED THE MOCKS

            
            await Assert.ThrowsAsync<Exception>(() => userService.AddAsync(userDto));
           

        }



        [Fact]
        public async void ShouldNotRegisterUser2() //user info is invalid, mappers throws error
        {
            DateTime d = new DateTime(2002, 10, 18);
            // START THE MOCKS
            DDDSample1.Domain.Roles.Role role = new DDDSample1.Domain.Roles.Role("User");
            User user = new User("name1", "email1@gmail.com", "street", "city", "country", d);
            RegisterUserDto userDto = new RegisterUserDto("name1", "email1@gmail.com", "street", "city", "country", null, "password", d);

            var userMapper = new Mock<IUserMapper>();
            userMapper.Setup(o => o.MapFromRegisterUserDtoToDomain(userDto))
              .Throws(new Exception());
            userMapper.Setup(o => o.MapFromDomain2Dto(user))
            .Returns(userDto);

            var roleRepository = new Mock<IRoleRepository>();
           
            roleRepository.Setup(o => o.GetByIdAsync(user.RoleName))
               .Returns(Task.FromResult(role));
            var userRepository = new Mock<IUserRepository>();
            userRepository.Setup(o => o.AddAsync(user))
               .Returns(Task.FromResult(user));
            userRepository = new Mock<IUserRepository>();

            User temp = null;
            userRepository.Setup(o => o.GetByEmailAsync(user.Email.Email))
               .Returns(Task.FromResult(temp));

            var jwtMock = new Mock<IJwtProvider>();

            var hasher = new Mock<IPasswordHasher<User>>();

            var email = new Mock<ISendEmail>();
            email.Setup(o => o.sendEmail(null, null, null))
              .Returns(true);

            //mocking unit of work
            var unitOfWork = new Mock<IUnitOfWork>();
            unitOfWork.Setup(o => o.CommitAsync())
                .Returns(Task.FromResult(200));


            var userService = new UserService(unitOfWork.Object, userRepository.Object, userMapper.Object, roleRepository.Object, hasher.Object, jwtMock.Object, email.Object);
            // ENDED THE MOCKS


            await Assert.ThrowsAsync<Exception>(() => userService.AddAsync(userDto));


        }




        [Fact]
        public async void ShouldNotRegisterUser3() //unit of works throws
        {
            DateTime d = new DateTime(2002, 10, 18);
            // START THE MOCKS
            DDDSample1.Domain.Roles.Role role = new DDDSample1.Domain.Roles.Role("User");
            User user = new User("name1", "email1@gmail.com", "street", "city", "country", d);
            RegisterUserDto userDto = new RegisterUserDto("name1", "email1@gmail.com", "street", "city", "country", null, "password", d);

            var userMapper = new Mock<IUserMapper>();
            userMapper.Setup(o => o.MapFromRegisterUserDtoToDomain(userDto))
              .Returns(user);
            userMapper.Setup(o => o.MapFromDomain2Dto(user))
            .Returns(userDto);

            var roleRepository = new Mock<IRoleRepository>();

            roleRepository.Setup(o => o.GetByIdAsync(user.RoleName))
               .Returns(Task.FromResult(role));
            var userRepository = new Mock<IUserRepository>();
            userRepository.Setup(o => o.AddAsync(user))
               .Returns(Task.FromResult(user));
            userRepository = new Mock<IUserRepository>();

            User temp = null;
            userRepository.Setup(o => o.GetByEmailAsync(user.Email.Email))
               .Returns(Task.FromResult(temp));

            var jwtMock = new Mock<IJwtProvider>();

            var hasher = new Mock<IPasswordHasher<User>>();

            var email = new Mock<ISendEmail>();
            email.Setup(o => o.sendEmail(null, null, null))
              .Returns(true);

            //mocking unit of work
            var unitOfWork = new Mock<IUnitOfWork>();
            unitOfWork.Setup(o => o.CommitAsync())
                .Throws(new Exception());


            var userService = new UserService(unitOfWork.Object, userRepository.Object, userMapper.Object, roleRepository.Object, hasher.Object, jwtMock.Object,email.Object);
            // ENDED THE MOCKS


            await Assert.ThrowsAsync<Exception>(() => userService.AddAsync(userDto));


        }


        [Fact]
        public async void ShouldLoginUser() 
        {
            DateTime d = new DateTime(2002, 10, 18);
            // START THE MOCKS
            DDDSample1.Domain.Roles.Role role = new DDDSample1.Domain.Roles.Role("User");
            User user = new User("name1", "email1@gmail.com", "street", "city", "country", d);
            LoginUserDto userDto = new LoginUserDto("email1@gmail.com", "password");
            LoginResultDto resultuserDto = new LoginResultDto("email1@gmail.com", "role","token","name");
            var userMapper = new Mock<IUserMapper>();
        
            userMapper.Setup(o => o.MapFromDomainToLoginResult(user, resultuserDto.Token))
            .Returns(resultuserDto);

            var roleRepository = new Mock<IRoleRepository>();


            var userRepository = new Mock<IUserRepository>();
           

            //User temp = null;
            userRepository.Setup(o => o.GetByEmailAsync(user.Email.Email))
               .Returns(Task.FromResult(user));

            var jwtMock = new Mock<IJwtProvider>();
            jwtMock.Setup(o => o.GenerateJwtToken(user))
              .Returns("token");

            var hasher = new Mock<IPasswordHasher<User>>();
            hasher.Setup(o => o.VerifyHashedPassword(user,user.HashedPassword,userDto.Password))
              .Returns(PasswordVerificationResult.Success);


            var email = new Mock<ISendEmail>();
            email.Setup(o => o.sendEmail(null, null, null))
              .Returns(true);

            var unitOfWork = new Mock<IUnitOfWork>();
           


            var userService = new UserService(unitOfWork.Object, userRepository.Object, userMapper.Object, roleRepository.Object, hasher.Object, jwtMock.Object, email.Object);
            // ENDED THE MOCKS

            var res = await userService.LoginUser(userDto);

            Assert.Equal(res.Email, userDto.Email);
            Assert.Equal("token",res.Token );
            
        }




        [Fact]
        public async void ShouldNotLoginUser1()// should not login becouse becouse  password is invalid
        {
            DateTime d = new DateTime(2002, 10, 18);
            // START THE MOCKS
            DDDSample1.Domain.Roles.Role role = new DDDSample1.Domain.Roles.Role("User");
            User user = new User("name1", "email1@gmail.com", "street", "city", "country", d);
            LoginUserDto userDto = new LoginUserDto("name1", "password");
            LoginResultDto resultuserDto = new LoginResultDto("email", "role", "token", "name");
            var userMapper = new Mock<IUserMapper>();

            userMapper.Setup(o => o.MapFromDomainToLoginResult(user, resultuserDto.Token))
            .Returns(resultuserDto);

            var roleRepository = new Mock<IRoleRepository>();


            var userRepository = new Mock<IUserRepository>();


            //User temp = null;
            userRepository.Setup(o => o.GetByEmailAsync(user.Email.Email))
               .Returns(Task.FromResult(user));

            var jwtMock = new Mock<IJwtProvider>();
            jwtMock.Setup(o => o.GenerateJwtToken(user))
              .Returns("token");

            var hasher = new Mock<IPasswordHasher<User>>();
            hasher.Setup(o => o.VerifyHashedPassword(user, user.HashedPassword, userDto.Password))
              .Returns(PasswordVerificationResult.Failed);

            var email = new Mock<ISendEmail>();
            email.Setup(o => o.sendEmail(null, null, null))
              .Returns(true);

            var unitOfWork = new Mock<IUnitOfWork>();



            var userService = new UserService(unitOfWork.Object, userRepository.Object, userMapper.Object, roleRepository.Object, hasher.Object, jwtMock.Object,email.Object);
            // ENDED THE MOCKS


            await Assert.ThrowsAsync<Exception>(() => userService.LoginUser(userDto));


        }




        [Fact]
        public async void ShouldNotLoginUser2()// should not login becouse becouse email is invalid
        {
            DateTime d = new DateTime(2002, 10, 18);
            // START THE MOCKS
            DDDSample1.Domain.Roles.Role role = new DDDSample1.Domain.Roles.Role("User");
            User user = new User("name1", "email1@gmail.com", "street", "city", "country", d);
            LoginUserDto userDto = new LoginUserDto("name1", "password");
            LoginResultDto resultuserDto = new LoginResultDto("email", "role", "token", "name");
            var userMapper = new Mock<IUserMapper>();

            userMapper.Setup(o => o.MapFromDomainToLoginResult(user, resultuserDto.Token))
            .Returns(resultuserDto);

            var roleRepository = new Mock<IRoleRepository>();


            var userRepository = new Mock<IUserRepository>();


            User temp = null;
            userRepository.Setup(o => o.GetByEmailAsync(user.Email.Email))
               .Returns(Task.FromResult(temp));

            var jwtMock = new Mock<IJwtProvider>();
            jwtMock.Setup(o => o.GenerateJwtToken(user))
              .Returns("token");

            var hasher = new Mock<IPasswordHasher<User>>();
            hasher.Setup(o => o.VerifyHashedPassword(user, user.HashedPassword, userDto.Password))
              .Returns(PasswordVerificationResult.Success);

            var email = new Mock<ISendEmail>();
            email.Setup(o => o.sendEmail(null, null, null))
              .Returns(true);

            var unitOfWork = new Mock<IUnitOfWork>();



            var userService = new UserService(unitOfWork.Object, userRepository.Object, userMapper.Object, roleRepository.Object, hasher.Object, jwtMock.Object,email.Object);
            // ENDED THE MOCKS


            await Assert.ThrowsAsync<Exception>(() => userService.LoginUser(userDto));


        }


        [Fact]
        public async void ShouldForgetUser()
        {
            
            // set the received parameters and expected response
            string receivedEmail = "rogernio@gmail.com";
          

            DateTime d = new DateTime(2002, 10, 18);
            // START THE MOCKS
            DDDSample1.Domain.Roles.Role role = new DDDSample1.Domain.Roles.Role("User");
            User user = new User("name1", "rogernio@gmail.com", "street", "city", "country", d);
        
            var userMapper = new Mock<IUserMapper>();

        

            var userRepository = new Mock<IUserRepository>();
            var roleRepository = new Mock<IRoleRepository>();

            userRepository.Setup(o => o.GetByEmailAsync(It.IsAny<string>()))
               .Returns(Task.FromResult(user));
            userRepository.Setup(o => o.UpdateUser(It.IsAny<User>()))
          .Returns(user);

            var jwtMock = new Mock<IJwtProvider>();
           

            var hasher = new Mock<IPasswordHasher<User>>();
            hasher.Setup(o => o.VerifyHashedPassword(It.IsAny<User>(),It.IsAny<string>(), It.IsAny<string>()))
                 .Returns(PasswordVerificationResult.Success);

            var email = new Mock<ISendEmail>();
        

            var unitOfWork = new Mock<IUnitOfWork>();

            ForgetUserDto dto = new ForgetUserDto(receivedEmail,"password1");

            var userService = new UserService(unitOfWork.Object, userRepository.Object, userMapper.Object, roleRepository.Object, hasher.Object, jwtMock.Object, email.Object);
            // ENDED THE MOCKS
            Boolean result = await userService.ForgetUser(dto);
             Assert.True(result);


        }


        [Fact]
        public async void ShouldNotForgetUser_RepositoryTrowsException()
        {

            // set the received parameters and expected response
            string receivedEmail = "rogernio@gmail.com";


            DateTime d = new DateTime(2002, 10, 18);
            // START THE MOCKS
            DDDSample1.Domain.Roles.Role role = new DDDSample1.Domain.Roles.Role("User");
            User user = new User("name1", "rogernio@gmail.com", "street", "city", "country", d);
        
            var userMapper = new Mock<IUserMapper>();

          

            var userRepository = new Mock<IUserRepository>();
            var roleRepository = new Mock<IRoleRepository>();


           

            var jwtMock = new Mock<IJwtProvider>();
         

            var hasher = new Mock<IPasswordHasher<User>>();
        

            var email = new Mock<ISendEmail>();
          

            var unitOfWork = new Mock<IUnitOfWork>();
            // ENDED THE MOCKS


            var userService = new UserService(unitOfWork.Object, userRepository.Object, userMapper.Object, roleRepository.Object, hasher.Object, jwtMock.Object, email.Object);
            ForgetUserDto dto = new ForgetUserDto(receivedEmail, "password1");

            await Assert.ThrowsAsync<Exception>(() => userService.ForgetUser(dto));


        }


        [Fact]
        public async void ShouldNotForgetUser_UserWithSuchEmailDontExists()
        {

            // set the received parameters and expected response
            string receivedEmail = "rogernio@gmail.com";


            DateTime d = new DateTime(2002, 10, 18);
            // START THE MOCKS
            

            User user = new User("name1", "rogernio@gmail.com", "street", "city", "country", d);

            var userMapper = new Mock<IUserMapper>();

        
            var userRepository = new Mock<IUserRepository>();
            var roleRepository = new Mock<IRoleRepository>();

            User temp = null;
            userRepository.Setup(o => o.GetByEmailAsync(receivedEmail))
               .Returns(Task.FromResult(temp));

            var jwtMock = new Mock<IJwtProvider>();
            jwtMock.Setup(o => o.GenerateJwtToken(user))
              .Returns("token");

            var hasher = new Mock<IPasswordHasher<User>>();
          

            var email = new Mock<ISendEmail>();
          

            var unitOfWork = new Mock<IUnitOfWork>();
            // ENDED THE MOCKS


            var userService = new UserService(unitOfWork.Object, userRepository.Object, userMapper.Object, roleRepository.Object, hasher.Object, jwtMock.Object, email.Object);
            ForgetUserDto dto = new ForgetUserDto(receivedEmail, "password1");
            await Assert.ThrowsAsync<Exception>(() => userService.ForgetUser(dto));


        }


        [Fact]
        public async void ShouldNotForgetUser_PasswordProvidedDontMatchTheUser()
        {

            // set the received parameters and expected response
            string receivedEmail = "rogernio@gmail.com";


            DateTime d = new DateTime(2002, 10, 18);
            // START THE MOCKS
            DDDSample1.Domain.Roles.Role role = new DDDSample1.Domain.Roles.Role("User");
            User user = new User("name1", "rogernio@gmail.com", "street", "city", "country", d);

            var userMapper = new Mock<IUserMapper>();



            var userRepository = new Mock<IUserRepository>();
            var roleRepository = new Mock<IRoleRepository>();

            userRepository.Setup(o => o.GetByEmailAsync(It.IsAny<string>()))
               .Returns(Task.FromResult(user));
            userRepository.Setup(o => o.UpdateUser(It.IsAny<User>()))
          .Returns(user);

            var jwtMock = new Mock<IJwtProvider>();


            var hasher = new Mock<IPasswordHasher<User>>();
            hasher.Setup(o => o.VerifyHashedPassword(It.IsAny<User>(), It.IsAny<string>(), It.IsAny<string>()))
                 .Returns(PasswordVerificationResult.Failed);

            var email = new Mock<ISendEmail>();


            var unitOfWork = new Mock<IUnitOfWork>();

            ForgetUserDto dto = new ForgetUserDto(receivedEmail, "password1");

            var userService = new UserService(unitOfWork.Object, userRepository.Object, userMapper.Object, roleRepository.Object, hasher.Object, jwtMock.Object, email.Object);
            // ENDED THE MOCKS

            await Assert.ThrowsAsync<Exception>(() => userService.ForgetUser(dto));


        }


        [Fact]
        public async void ShouldNotForgetUser_EmailInDtoIsEmpty()
        {

            // set the received parameters and expected response
            string receivedEmail = "";


            DateTime d = new DateTime(2002, 10, 18);
            // START THE MOCKS
            DDDSample1.Domain.Roles.Role role = new DDDSample1.Domain.Roles.Role("User");
            User user = new User("name1", "rogernio@gmail.com", "street", "city", "country", d);

            var userMapper = new Mock<IUserMapper>();



            var userRepository = new Mock<IUserRepository>();
            var roleRepository = new Mock<IRoleRepository>();

            userRepository.Setup(o => o.GetByEmailAsync(It.IsAny<string>()))
               .Returns(Task.FromResult(user));
            userRepository.Setup(o => o.UpdateUser(It.IsAny<User>()))
          .Returns(user);

            var jwtMock = new Mock<IJwtProvider>();


            var hasher = new Mock<IPasswordHasher<User>>();
            hasher.Setup(o => o.VerifyHashedPassword(It.IsAny<User>(), It.IsAny<string>(), It.IsAny<string>()))
                 .Returns(PasswordVerificationResult.Success);

            var email = new Mock<ISendEmail>();


            var unitOfWork = new Mock<IUnitOfWork>();

            ForgetUserDto dto = new ForgetUserDto(receivedEmail, "password1");

            var userService = new UserService(unitOfWork.Object, userRepository.Object, userMapper.Object, roleRepository.Object, hasher.Object, jwtMock.Object, email.Object);
            // ENDED THE MOCKS
            await Assert.ThrowsAsync<Exception>(() => userService.ForgetUser(dto));


        }


        [Fact]
        public async void ShouldNotForgetUser_EmailInDtoIsnull()
        {

            // set the received parameters and expected response
            string receivedEmail = null;


            DateTime d = new DateTime(2002, 10, 18);
            // START THE MOCKS
            DDDSample1.Domain.Roles.Role role = new DDDSample1.Domain.Roles.Role("User");
            User user = new User("name1", "rogernio@gmail.com", "street", "city", "country", d);

            var userMapper = new Mock<IUserMapper>();



            var userRepository = new Mock<IUserRepository>();
            var roleRepository = new Mock<IRoleRepository>();

            userRepository.Setup(o => o.GetByEmailAsync(It.IsAny<string>()))
               .Returns(Task.FromResult(user));
            userRepository.Setup(o => o.UpdateUser(It.IsAny<User>()))
          .Returns(user);

            var jwtMock = new Mock<IJwtProvider>();


            var hasher = new Mock<IPasswordHasher<User>>();
            hasher.Setup(o => o.VerifyHashedPassword(It.IsAny<User>(), It.IsAny<string>(), It.IsAny<string>()))
                 .Returns(PasswordVerificationResult.Success);

            var email = new Mock<ISendEmail>();


            var unitOfWork = new Mock<IUnitOfWork>();

            ForgetUserDto dto = new ForgetUserDto(receivedEmail, "password1");

            var userService = new UserService(unitOfWork.Object, userRepository.Object, userMapper.Object, roleRepository.Object, hasher.Object, jwtMock.Object, email.Object);
            // ENDED THE MOCKS
            await Assert.ThrowsAsync<Exception>(() => userService.ForgetUser(dto));


        }


        [Fact]
        public async void ShouldNotForgetUser_PasswordInDtoIsEmpty()
        {

            // set the received parameters and expected response
            string receivedEmail = "rogernio@gmail.com";


            DateTime d = new DateTime(2002, 10, 18);
            // START THE MOCKS
            DDDSample1.Domain.Roles.Role role = new DDDSample1.Domain.Roles.Role("User");
            User user = new User("name1", "rogernio@gmail.com", "street", "city", "country", d);

            var userMapper = new Mock<IUserMapper>();



            var userRepository = new Mock<IUserRepository>();
            var roleRepository = new Mock<IRoleRepository>();

            userRepository.Setup(o => o.GetByEmailAsync(It.IsAny<string>()))
               .Returns(Task.FromResult(user));
            userRepository.Setup(o => o.UpdateUser(It.IsAny<User>()))
          .Returns(user);

            var jwtMock = new Mock<IJwtProvider>();


            var hasher = new Mock<IPasswordHasher<User>>();
            hasher.Setup(o => o.VerifyHashedPassword(It.IsAny<User>(), It.IsAny<string>(), It.IsAny<string>()))
                 .Returns(PasswordVerificationResult.Success);

            var email = new Mock<ISendEmail>();


            var unitOfWork = new Mock<IUnitOfWork>();

            ForgetUserDto dto = new ForgetUserDto(receivedEmail, "");

            var userService = new UserService(unitOfWork.Object, userRepository.Object, userMapper.Object, roleRepository.Object, hasher.Object, jwtMock.Object, email.Object);
            // ENDED THE MOCKS
            await Assert.ThrowsAsync<Exception>(() => userService.ForgetUser(dto));


        }


        [Fact]
        public async void ShouldNotForgetUser_PasswordInDtoIsNull()
        {

            // set the received parameters and expected response
            string receivedEmail = "rogernio@gmail.com";


            DateTime d = new DateTime(2002, 10, 18);
            // START THE MOCKS
            DDDSample1.Domain.Roles.Role role = new DDDSample1.Domain.Roles.Role("User");
            User user = new User("name1", "rogernio@gmail.com", "street", "city", "country", d);

            var userMapper = new Mock<IUserMapper>();



            var userRepository = new Mock<IUserRepository>();
            var roleRepository = new Mock<IRoleRepository>();

            userRepository.Setup(o => o.GetByEmailAsync(It.IsAny<string>()))
               .Returns(Task.FromResult(user));
            userRepository.Setup(o => o.UpdateUser(It.IsAny<User>()))
          .Returns(user);

            var jwtMock = new Mock<IJwtProvider>();


            var hasher = new Mock<IPasswordHasher<User>>();
            hasher.Setup(o => o.VerifyHashedPassword(It.IsAny<User>(), It.IsAny<string>(), It.IsAny<string>()))
                 .Returns(PasswordVerificationResult.Success);

            var email = new Mock<ISendEmail>();


            var unitOfWork = new Mock<IUnitOfWork>();

            ForgetUserDto dto = new ForgetUserDto(receivedEmail, null);

            var userService = new UserService(unitOfWork.Object, userRepository.Object, userMapper.Object, roleRepository.Object, hasher.Object, jwtMock.Object, email.Object);
            // ENDED THE MOCKS
            await Assert.ThrowsAsync<Exception>(() => userService.ForgetUser(dto));


        }

    }
}
