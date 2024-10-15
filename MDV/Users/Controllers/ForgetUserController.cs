
using DDDSample1.Domain.Users;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

using System;

using System.Threading.Tasks;

using DDDNetCore.Utils.Jwt;

using DDDNetCore.Users.Dtos;

namespace DDDSample1.Controllers
{
    [Route("mdvapi/[controller]")]
    [ApiController]
    public class ForgetUserController :  ControllerBase
    {

        private readonly IUserService _service;
      
        
        
        public ForgetUserController(IUserService service)
        {
            _service = service;
            
         
        }

        [HttpPost]
        [Authorize(Roles = "User,Manager,Admin")]
        public async Task<IActionResult> ForgetUser(ForgetUserDto dto)
        {


            try
            {
                //obtaining the email in jwt token
                string emailInToken=null;

                var principal = HttpContext.User;
                if (principal?.Claims != null)
                {
               
                 
                    foreach (var claim in principal.Claims)
                    {
                       
                        string claimType = claim.Type;
                        
                        if (claimType == "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier")
                        {
                            emailInToken = claim.Value;
                            break;
                        }
                       
                    }

                }
                // verify if email sent in body is the same as in the jwt token
                if (!emailInToken.Equals(dto.Email)){
                    dto.defineUnauthorizeMessage();
                    return Unauthorized(dto); // if email sent in body dont match the real user trying to delete his account 
                }

                Boolean isForgotten = await _service.ForgetUser(dto);
                if (isForgotten)
                {
                    dto.defineSuccessMessage();
                    return Ok(dto);
                }
                else
                {
                    dto.defineInvalidMessage(null);
                    return BadRequest(dto);
                }
            
            }
            catch (Exception err)
            {
                dto.defineInvalidMessage(err.Message);
                return BadRequest(dto);
            }

        }

        }
}
