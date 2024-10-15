
using DDDNetCore.Utils.Email;
using DDDSample1.Domain.Users;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

namespace DDDSample1.Controllers
{

    [Route("mdvapi/User")]
    [ApiController]
    public class RegisterUserController : ControllerBase
    {
        private readonly IUserService _service;
        private readonly ISendEmail _sendEmail;

        public RegisterUserController(IUserService service, ISendEmail sendEmail)
        {
            _service = service;
            _sendEmail = sendEmail;
        }
       
        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterUserDto dto)
        {
           
            try
            {
                var registerUserDto = await _service.AddAsync(dto);
                _sendEmail.sendEmail(dto.Email, "OPT Registration", dto.Password);
                return Ok(registerUserDto);
            }
            catch (Exception err)
            {
                if (err.Message.Contains("already"))
                {
                    return APIErrorHandling.Result(HttpStatusCode.UnprocessableEntity, err.Message);
                }
                else if (err.InnerException != null)
                {
                    return APIErrorHandling.Result(HttpStatusCode.BadRequest, err.InnerException.Message);
                }
                else
                {
                    return APIErrorHandling.Result(HttpStatusCode.BadRequest, err.Message);
                }
            }
           

        }

    }
}
