using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using DDDNetCore.Vehicles.Dto;
using DDDNetCore.Vehicles.Services;
using DDDSample1.Controllers;
using Microsoft.Extensions.Primitives;
using Org.BouncyCastle.Asn1.Ocsp;
using Microsoft.AspNetCore.Authorization;

namespace DDDNetCore.Vehicles.Controllers
{
    [Route("mdvapi/Vehicle")]
    [ApiController]
    public class RegisterVehicleController : ControllerBase
    {
       
        private readonly IVehicleService _service;
        public RegisterVehicleController(IVehicleService service)
            {
                _service = service;
            }

            [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<VehicleDto>> Register(VehicleDto dto)
            {
                string token;
                StringValues authorizationToken;
                this.Request.Headers.TryGetValue("Authorization", out authorizationToken); ;
                token = authorizationToken;
            try
                {
                    var vehicleDto = await _service.AddAsync(token,dto);
                    return Ok(vehicleDto);
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

