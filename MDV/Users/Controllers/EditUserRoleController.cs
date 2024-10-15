
using DDDSample1.Domain.Users;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;


namespace DDDSample1.Controllers
{
    [Route("mdvapi/[controller]")]
    [ApiController]
    public class EditUserRoleController :  ControllerBase
    {

        private readonly IUserService _service;

        
        public EditUserRoleController(IUserService service)
        {
            _service = service;
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> EditUser(EditUserDto editUserDto)
        {
            try
            {
                EditUserDto editedUserDto = await _service.EditUser(editUserDto);
                return Ok(editedUserDto);
            }
            catch (Exception err)
            {
                return APIErrorHandling.Result(HttpStatusCode.BadRequest, err.Message);
            }

        }

        }
}
