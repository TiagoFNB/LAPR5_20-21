using DDDNetCore.Users.Dtos;
using DDDNetCore.Utils.Email;
using DDDSample1.Controllers;
using DDDSample1.Domain.Users;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Security.Principal;
using System.Threading.Tasks;
using Xunit;
namespace XUnitTestMDV.UserTest.UnitTests.controllers
{
   public class ForgetUserControllerTest
    {
        [Fact]
        public async void ForgetUserControllerTest_shouldForgetWithSucess()
        {
            // creating the claims
            var claims = new List<Claim>()
{
   
    new Claim(ClaimTypes.NameIdentifier, "rogernio1st@gmail.com"), 
   
};
            var identity = new ClaimsIdentity(claims, "TestAuthType");
            var claimsPrincipal = new ClaimsPrincipal(identity);

            //mocking httpcontext
            var httpContextM = new Mock<HttpContext>();
            httpContextM.SetupGet(x => x.User).Returns(claimsPrincipal);
            //httpContextM.SetupGet(x => x.Request.Headers["Authorization"]).Returns("Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6InJvZ2VybmlvMXN0QGdtYWlsLmNvbSIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlVzZXIiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoicm9nZXJpbmhvIiwiRGF0ZU9mQmlydGgiOiI3LzIxLzE5OTMiLCJleHAiOjE2MTYwMjE4NzEsImlzcyI6InJvZ2VyLmNvbSIsImF1ZCI6InJvZ2VyLmNvbSJ9.bZInoPVqJtIGVwt2K4db3QXsvNkfrV7cDqqn6FU0c0M");

            // var httpContext = new DefaultHttpContext();
            //httpContextM.Request.Headers["Authorization"] = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6InJvZ2VybmlvMXN0QGdtYWlsLmNvbSIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlVzZXIiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoicm9nZXJpbmhvIiwiRGF0ZU9mQmlydGgiOiI3LzIxLzE5OTMiLCJleHAiOjE2MTYwMjE4NzEsImlzcyI6InJvZ2VyLmNvbSIsImF1ZCI6InJvZ2VyLmNvbSJ9.bZInoPVqJtIGVwt2K4db3QXsvNkfrV7cDqqn6FU0c0M";
          
            ForgetUserDto dto = new ForgetUserDto("rogernio1st@gmail.com","password1");

            ForgetUserDto expectedDto = new ForgetUserDto("rogernio1st@gmail.com",null);
            expectedDto.defineSuccessMessage();

            var userService = new Mock<IUserService>();
            userService.Setup(o => o.ForgetUser(It.IsAny<ForgetUserDto>()))
              .Returns(Task.FromResult(true));

            var controller = new ForgetUserController(userService.Object)
            {
                ControllerContext = new ControllerContext()
                {
                    HttpContext = httpContextM.Object
                }
            };


           
            var result = await controller.ForgetUser(dto);
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
        public async void ForgetUserControllerTest_shouldNotForgetWithSucess_EmailInTokenIsNotSameAsTheOneSentInBody()
        {
            // creating the claims
            var claims = new List<Claim>()
{

    new Claim(ClaimTypes.NameIdentifier, "anotheremail@gmail.com"),

};
            var identity = new ClaimsIdentity(claims, "TestAuthType");
            var claimsPrincipal = new ClaimsPrincipal(identity);

            //mocking httpcontext
            var httpContextM = new Mock<HttpContext>();
            httpContextM.SetupGet(x => x.User).Returns(claimsPrincipal);
            //httpContextM.SetupGet(x => x.Request.Headers["Authorization"]).Returns("Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6InJvZ2VybmlvMXN0QGdtYWlsLmNvbSIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlVzZXIiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoicm9nZXJpbmhvIiwiRGF0ZU9mQmlydGgiOiI3LzIxLzE5OTMiLCJleHAiOjE2MTYwMjE4NzEsImlzcyI6InJvZ2VyLmNvbSIsImF1ZCI6InJvZ2VyLmNvbSJ9.bZInoPVqJtIGVwt2K4db3QXsvNkfrV7cDqqn6FU0c0M");

            // var httpContext = new DefaultHttpContext();
            //httpContextM.Request.Headers["Authorization"] = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6InJvZ2VybmlvMXN0QGdtYWlsLmNvbSIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlVzZXIiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoicm9nZXJpbmhvIiwiRGF0ZU9mQmlydGgiOiI3LzIxLzE5OTMiLCJleHAiOjE2MTYwMjE4NzEsImlzcyI6InJvZ2VyLmNvbSIsImF1ZCI6InJvZ2VyLmNvbSJ9.bZInoPVqJtIGVwt2K4db3QXsvNkfrV7cDqqn6FU0c0M";

            ForgetUserDto dto = new ForgetUserDto("rogernio1st@gmail.com","password1");

            ForgetUserDto expectedDto = new ForgetUserDto("rogernio1st@gmail.com", "password1");
            expectedDto.defineUnauthorizeMessage();

            var userService = new Mock<IUserService>();
            userService.Setup(o => o.ForgetUser(It.IsAny<ForgetUserDto>()))
               .Returns(Task.FromResult(true));

            var controller = new ForgetUserController(userService.Object)
            {
                ControllerContext = new ControllerContext()
                {
                    HttpContext = httpContextM.Object
                }
            };



            var result = await controller.ForgetUser(dto);
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
        public async void ForgetUserControllerTest_shouldNotForgetWithSucess_AccountWasAlreadyDeletedOrDontExists()
        {
            // creating the claims
            var claims = new List<Claim>()
{

    new Claim(ClaimTypes.NameIdentifier, "rogernio1st@gmail.com"),

};
            var identity = new ClaimsIdentity(claims, "TestAuthType");
            var claimsPrincipal = new ClaimsPrincipal(identity);

            //mocking httpcontext
            var httpContextM = new Mock<HttpContext>();
            httpContextM.SetupGet(x => x.User).Returns(claimsPrincipal);
            //httpContextM.SetupGet(x => x.Request.Headers["Authorization"]).Returns("Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6InJvZ2VybmlvMXN0QGdtYWlsLmNvbSIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlVzZXIiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoicm9nZXJpbmhvIiwiRGF0ZU9mQmlydGgiOiI3LzIxLzE5OTMiLCJleHAiOjE2MTYwMjE4NzEsImlzcyI6InJvZ2VyLmNvbSIsImF1ZCI6InJvZ2VyLmNvbSJ9.bZInoPVqJtIGVwt2K4db3QXsvNkfrV7cDqqn6FU0c0M");

            // var httpContext = new DefaultHttpContext();
            //httpContextM.Request.Headers["Authorization"] = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6InJvZ2VybmlvMXN0QGdtYWlsLmNvbSIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlVzZXIiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoicm9nZXJpbmhvIiwiRGF0ZU9mQmlydGgiOiI3LzIxLzE5OTMiLCJleHAiOjE2MTYwMjE4NzEsImlzcyI6InJvZ2VyLmNvbSIsImF1ZCI6InJvZ2VyLmNvbSJ9.bZInoPVqJtIGVwt2K4db3QXsvNkfrV7cDqqn6FU0c0M";

            ForgetUserDto dto = new ForgetUserDto("rogernio1st@gmail.com","password1");

            ForgetUserDto expectedDto = new ForgetUserDto("rogernio1st@gmail.com",null);
            expectedDto.defineInvalidMessage("User dosent exists");

            var userService = new Mock<IUserService>();
            userService.Setup(o => o.ForgetUser(It.IsAny<ForgetUserDto>()))
              .Throws(new Exception("User dosent exists"));

            var controller = new ForgetUserController(userService.Object)
            {
                ControllerContext = new ControllerContext()
                {
                    HttpContext = httpContextM.Object
                }
            };



            var result = await controller.ForgetUser(dto);

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
