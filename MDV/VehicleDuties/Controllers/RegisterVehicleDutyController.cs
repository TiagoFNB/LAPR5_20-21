using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using DDDNetCore.VehicleDuties.Dto;
using DDDNetCore.VehicleDuties.Services;
using DDDSample1.Controllers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DDDNetCore.VehicleDuties.Controllers
{
    [Route("mdvapi/VehicleDuty")]
    [ApiController]
    public class RegisterVehicleDutyController : ControllerBase
    {

        private readonly IVehicleDutyService _service;


        public RegisterVehicleDutyController(IVehicleDutyService service)
        {
            _service = service;
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<VehicleDutyDto>> Register(VehicleDutyDto dto)
        {
           
            try
            {
                var vehicleDutyDto = await _service.AddAsync( dto);
                return Ok(vehicleDutyDto);
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
