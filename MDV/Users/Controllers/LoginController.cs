using DDDSample1.Domain.Users;
using Microsoft.AspNetCore.Mvc;
using System;

using System.Net;

using System.Threading.Tasks;


using Newtonsoft.Json.Linq;

namespace DDDSample1.Controllers
{
    [Route("mdvapi/User")]
    [ApiController]
    public class LoginController : ControllerBase
    {

        private readonly IUserService _service;

        public LoginController(IUserService service)
        {
            _service = service;
        }


        [HttpPost("login")]
        public async Task<IActionResult> LoginAction(LoginUserDto loginUserDto)
        {
            try
            {
                LoginResultDto loginResult = await _service.LoginUser(loginUserDto);
                //dynamic JsonResponse = new JObject();
                //JsonResponse.token = token;
                return Ok(loginResult);
            }
            catch(Exception err)
            {
                return APIErrorHandling.Result(HttpStatusCode.BadRequest, err.Message);
            }
            
        }
    }
}
