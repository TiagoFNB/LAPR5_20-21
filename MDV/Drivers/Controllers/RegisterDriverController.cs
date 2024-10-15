using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using DDDNetCore.Drivers.Dto;
using DDDNetCore.Drivers.Services;
using DDDSample1.Controllers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Primitives;
using Microsoft.AspNetCore.Authorization;
namespace DDDNetCore.Drivers.Controllers
{
    [Route("mdvapi/Driver")]
    [ApiController]
    public class RegisterDriverController : ControllerBase
    {

        private readonly IDriverService _service;


        public RegisterDriverController(IDriverService service)
        {
            _service = service;
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<DriverDto>> Register(DriverDto dto)
        {
            string token;
            StringValues authorizationToken;
            this.Request.Headers.TryGetValue("Authorization", out authorizationToken); 
            token = authorizationToken;
            try
            {
                var driverDto = await _service.AddAsync(token, dto);
                return Ok(driverDto);
            }
            catch (Exception err)
            {
                if (err.InnerException != null)
                {
                    if (err.InnerException.Message.Contains("duplicate"))
                    {
                        return APIErrorHandling.Result(HttpStatusCode.UnprocessableEntity, err.InnerException.Message);
                    }
                    else
                    {
                        return APIErrorHandling.Result(HttpStatusCode.BadRequest, err.InnerException.Message);
                    }
                }
                else
                {
                    return APIErrorHandling.Result(HttpStatusCode.BadRequest, err.Message);
                }
            }


        }

    }
}