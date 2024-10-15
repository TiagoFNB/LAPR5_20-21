using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using DDDNetCore.Trips.Services;
using DDDSample1.Controllers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Primitives;

namespace DDDNetCore.Trips.Controllers
{
    [Route("mdvapi/trip")]
    [ApiController]
    public class GetListTripsController : ControllerBase
    {
        private readonly IListTripsService _service;

        public GetListTripsController(IListTripsService service)
        {
            _service = service;
        }

        //Method get for trips request
        [HttpGet]
        [Authorize(Roles = "User,Manager,Admin")]
        public async Task<IActionResult> List()
        {

            try
            {
                var responseTrips = await _service.GetAllAsync();
                return Ok(responseTrips);
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
