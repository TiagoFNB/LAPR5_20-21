using DDDNetCore.DriverDuties.Dto;
using DDDNetCore.DriverDuties.Services;
using DDDSample1.Controllers;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Net;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
namespace DDDNetCore.DriverDuties.Controllers
{
    [Route("mdvapi/DriverDuty")]
    [ApiController]
    public class RegisterDriverDutyController : ControllerBase
    {

        private readonly IDriverDutyService _service;


        public RegisterDriverDutyController(IDriverDutyService service)
        {
            _service = service;
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<DriverDutyDto>> Register(DriverDutyDto dto)
        {
            try
            {
                var driverServiceDto = await _service.AddAsync(dto);
                return Ok(driverServiceDto);
            }
            catch (Exception err)
            { 
                if (err.InnerException != null)
                {
                    if (err.InnerException.Message.Contains("duplicate"))
                    {
                        return APIErrorHandling.Result(HttpStatusCode.UnprocessableEntity, err.Message);
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
