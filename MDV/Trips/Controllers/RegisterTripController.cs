
using DDDNetCore.Trips.DTO;
using DDDNetCore.Trips.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using DDDSample1.Controllers;
using Microsoft.Extensions.Primitives;


namespace DDDNetCore.Trips.Controllers
{
    [Route("mdvapi/trip")]
    [ApiController]
    public class RegisterTripController : ControllerBase
    {

        private readonly IRegisterTripService _service;


        public RegisterTripController(IRegisterTripService service)
        {
            _service = service;
        }

        //Method post for trip request (A doc or with frequency)
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Register(RegisterTripsDto dto)
        {
            
            try
            {
                StringValues authorizationToken;
                this.Request.Headers.TryGetValue("Authorization", out authorizationToken); ;
                string token = authorizationToken;



                var registerTripDto = await _service.AddAsync(token, dto);
                return Ok(registerTripDto);
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