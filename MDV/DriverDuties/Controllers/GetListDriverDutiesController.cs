using System;
using System.Net;
using System.Threading.Tasks;
using DDDNetCore.DriverDuties.Services;
using DDDSample1.Controllers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DDDNetCore.DriverDuties.Controllers
{
    [Route("mdvapi/DriverDuty")]
    [ApiController]
    public class GetListDriverDutiesController : ControllerBase
    {
        private readonly IListDriverDutiesService _service;

        public GetListDriverDutiesController(IListDriverDutiesService service)
        {
            _service = service;
        }

        //Method get for vehicle duties request
        [HttpGet]
        [Authorize(Roles = "User,Manager,Admin")]
        public async Task<IActionResult> List()
        {

            try
            {
                var dtos = await _service.GetAllAsync();
                return Ok(dtos);
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
