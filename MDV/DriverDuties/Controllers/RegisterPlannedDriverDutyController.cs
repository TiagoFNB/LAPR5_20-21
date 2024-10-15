using DDDNetCore.DriverDuties.Dto;
using DDDNetCore.DriverDuties.Services;
using DDDSample1.Controllers;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Net;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using System.Collections.Generic;

namespace DDDNetCore.DriverDuties.Controllers
{
    [Route("mdvapi/PlannedDriverDuty")]
    [ApiController]
    public class RegisterPlannedDriverDutyController : ControllerBase
    {

        private readonly IDriverDutyService _service;


        public RegisterPlannedDriverDutyController(IDriverDutyService service)
        {
            _service = service;
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Register(DriverDutyPlannedDtoList listDtos)

        {
            try
            {
                List<DriverDutyPlannedResponseDto> response = new List<DriverDutyPlannedResponseDto>();
                foreach (DriverDutyPlannedDto d in listDtos.lista)
                {
                    var serviceResponse = await _service.AddPlannedDriverDutyAsync(d);
                    response.Add(serviceResponse);

                }

               

                Boolean anyDriverDutyRegistered = false;

                

                for(int i=0;i< response.Count; i++)
                {
                    if (response[i].AffectedWorkBlockIList.Count > 0)
                    {
                        return Created("",response);
                    }
                    
                }

                return APIErrorHandling.Result(HttpStatusCode.BadRequest, "No driver duty could be registered");

                

              
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
