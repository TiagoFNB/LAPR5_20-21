using System;
using System.Net;
using System.Threading.Tasks;
using DDDNetCore.WorkBlocks.Services;
using DDDSample1.Controllers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DDDNetCore.WorkBlocks.Controllers
{
    [Route("mdvapi/WorkBlocks/DriverDuty")]
    [ApiController]
    public class GetListWorkBlocksByDriverDutyController : ControllerBase
    {
        private readonly IGetListWorkBlocksByDriverDutyService _service;

        public GetListWorkBlocksByDriverDutyController(IGetListWorkBlocksByDriverDutyService service)
        {
            _service = service;
        }


        //Method get for workblocks request
        [HttpGet("{id}")]
        [Authorize(Roles = "User,Manager,Admin")]
        public async Task<IActionResult> ListByDriverDuty(string id)
        {

            try
            {
                var res = await _service.GetAllAsync(id);
                return Ok(res);
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
