using DDDSample1.Controllers;
using DDDSample1.Domain.Roles;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

namespace DDDNetCore.Controllers
{
    [Route("mdvapi/[controller]")]
    [ApiController]
    //[Authorize(Roles = "Admin")]
    public class RoleController : ControllerBase
    {

        private readonly IRoleService _service;

        public RoleController(IRoleService service)
        {
            _service = service;
        }

        [HttpPost]
        [Authorize(Roles="Admin")]
        public async Task<IActionResult> Register(CreateRoleDto dto)
        {
            try
            {
                var CreateRoleDto = await _service.AddAsync(dto);
                
                return Ok(CreateRoleDto);
            }
            catch(Exception err)
            {
                //return Result(HttpStatusCode.Forbidden, err.Message);
                if(err.Message.Contains("already")){
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
