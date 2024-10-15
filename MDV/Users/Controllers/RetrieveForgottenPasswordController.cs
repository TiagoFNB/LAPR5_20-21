using DDDNetCore.Users.Dtos;
using DDDSample1.Domain.Users;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DDDSample1.Controllers
{
    [Route("mdvapi/User")]
    [ApiController]
    public class RetrieveForgottenPasswordController : ControllerBase
    {

        private readonly IUserService _service;

        public RetrieveForgottenPasswordController(IUserService service)
        {
            _service = service;
        }

        [HttpPost("retrievepassword")]

        public async Task<IActionResult> retrievePassword(RetrievePasswordDto dto)
        {

            try
            {
                 await _service.retrievePassword(dto.Email);
                return Ok();
            }
            catch(Exception err)
            {
                return Ok();

            }
               // will return an okay response in any case since i dont want users to know about if an email exists or not
                
          

        }


        
    }
}
