using DDDSample1.Domain.Roles;
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
    public class UserMapperTest
    {


        [Fact]
        public  void ShouldMapRegisterUserDto2Domain()// should not login becouse becouse email is invalid
        {

            LoginUserDto loguserDto = new LoginUserDto("name1", "password");
            LoginResultDto resultloguserDto = new LoginResultDto("email", "role", "token", "name");



            DateTime d = new DateTime(2002, 10, 18);

            User user = new User("name1", "email1@gmail.com", "street", "city", "country", d);

            RegisterUserDto reguserDto = new RegisterUserDto("name1", "email1@gmail.com", "street", "city", "country", null, "password", d);

            var hasher = new Mock<IPasswordHasher<User>>();
            hasher.Setup(o => o.HashPassword(user, reguserDto.Password))
              .Returns("PasswordHashed");

            UserMapper uM = new UserMapper(hasher.Object);

            var res = uM.MapFromRegisterUserDtoToDomain(reguserDto);
            Assert.Equal(res.Email.Email, reguserDto.Email);           
            Assert.Equal("User", res.RoleName.Value);
            Assert.Equal(reguserDto.City, res.Address.City);
            Assert.Equal(reguserDto.Street, res.Address.Street);
            Assert.Equal(reguserDto.Country, res.Address.Country);
            Assert.Equal(reguserDto.DateOfBirth.ToShortDateString(), res.UserDataOfBirth.dateOfBirth);

        }
        [Fact]
        public  void ShouldNotMapRegisterUserDto2Domain1()// password fails validation
        {

            LoginUserDto loguserDto = new LoginUserDto("name1", "password");
            LoginResultDto resultloguserDto = new LoginResultDto("email", "role", "token", "name");



            DateTime d = new DateTime(2002, 10, 18);

            User user = new User("name1", "email1@gmail.com", "street", "city", "country", d);

            RegisterUserDto reguserDto = new RegisterUserDto("name1", "email1@gmail.com", "street", "city", "country", null, "pass", d);

            var hasher = new Mock<IPasswordHasher<User>>();
            hasher.Setup(o => o.HashPassword(user, reguserDto.Password))
              .Returns("PasswordHashed");

            UserMapper uM = new UserMapper(hasher.Object);

            
             Assert.Throws<System.Exception>(() => uM.MapFromRegisterUserDtoToDomain(reguserDto));

        }



        [Fact]
        public  void ShouldMapLoginUserDto2Domain()
        {

                     

            DateTime d = new DateTime(2002, 10, 18);

            User user = new User("name1", "email1@gmail.com", "street", "city", "country", d);
            user.DefineRole("User");
           
            var hasher = new Mock<IPasswordHasher<User>>();
          
            UserMapper uM = new UserMapper(hasher.Object);
           
            
            LoginResultDto logReesult = uM.MapFromDomainToLoginResult(user, "token");


            Assert.Equal(user.Email.Email, logReesult.Email);
            Assert.Equal(logReesult.Role, user.RoleName.Value);
            Assert.Equal(logReesult.Name, user.Name.Name);
            Assert.Equal(logReesult.Token, "token");

        }




        [Fact]
        public  void ShouldMapFromDomain2Dto()
        {



            DateTime d = new DateTime(2002, 10, 18);

            User user = new User("name1", "email1@gmail.com", "street", "city", "country", d);
            user.DefineRole("User");
            user.DefineHashedPassword("thispass");
            var hasher = new Mock<IPasswordHasher<User>>();

            UserMapper uM = new UserMapper(hasher.Object);


            RegisterUserDto result = uM.MapFromDomain2Dto(user);


            Assert.Equal(result.Email, user.Email.Email);
            Assert.Equal(result.RoleName, user.RoleName.Value);
            Assert.Equal(result.Name, user.Name.Name);
            Assert.Equal(result.City, user.Address.City);
            Assert.Equal(result.Country, user.Address.Country);
            Assert.Equal(result.Street, user.Address.Street);
            Assert.Equal(result.Password,null);

        }


    }
}
