using DDDNetCore.WorkBlocks.Dto;
using DDDNetCore.WorkBlocks.Services;
using DDDSample1.Controllers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Primitives;
using System;
using System.Net;
using System.Threading.Tasks;

namespace DDDNetCore.WorkBlocks.Controllers
{
    [Route("mdvapi/WorkBlocks")]
    [ApiController]
    public class RegisterVehicleDutyWorkBlocksController : ControllerBase
    {

        private readonly IWorkBlocksOfVehicleDutyService _service;


        public RegisterVehicleDutyWorkBlocksController(IWorkBlocksOfVehicleDutyService service)
        {
            _service = service;
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<WorkBlockGeneratedDto>> Register(WorkBlockGeneratorDto dto)
        {
            try
            {
                string token;
                StringValues authorizationToken;
                this.Request.Headers.TryGetValue("Authorization", out authorizationToken);
                token = authorizationToken;

                var generatedDto = await _service.AddAsync(token,dto);
                return Ok(generatedDto);
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

