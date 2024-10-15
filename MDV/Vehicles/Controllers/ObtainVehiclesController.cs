using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using DDDNetCore.Vehicles.Dto;
using DDDNetCore.Vehicles.Services;
using DDDSample1.Controllers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Primitives;

namespace DDDNetCore.Vehicles.Controllers
{   [Route("mdvapi/Vehicle")] 
    [ApiController] 
    public class ObtainVehiclesController:ControllerBase
    {
        
        

            private readonly IVehicleService _service;
            public ObtainVehiclesController(IVehicleService service)
            {
                _service = service;
            }

            [HttpGet]
        [Authorize(Roles = "User,Manager,Admin")]
        public async Task<ActionResult<VehicleDto>> GetAll()
            {
                try
                {
                    var vehicleDto = await _service.GetAll();
                    return Ok(vehicleDto);
                }
                catch (Exception err)
                {
                    if (err.InnerException != null)
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
