using DDDNetCore.WorkBlocks.Dto;
using DDDNetCore.WorkBlocks.Services;
using DDDSample1.Controllers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;


namespace DDDNetCore.WorkBlocks.Controllers
{
    [Route("mdvapi/WorkBlocksByIds")]
    [ApiController]
    public class GetWorkBlocksByIdController : ControllerBase
    {

        private readonly IGetWorkBlockByIdService _service;

        public GetWorkBlocksByIdController(IGetWorkBlockByIdService service)
        {
            _service = service;
        }

        [HttpPost]
        [Authorize(Roles = "User,Manager,Admin")]
        public async Task<IActionResult> GetWorkBlocksById(List<WorkBlockDto> wbIds)
        {

            try
            {
                List <ReplyWorkBlockDto> listResponse = new List<ReplyWorkBlockDto>();
                foreach (WorkBlockDto wb in wbIds)
                {
                    if (wb.Code != null)
                    {

                
                    var Dto = await _service.GetAsync(wb.Code);
                    if (Dto != null)
                    {
                        listResponse.Add(Dto);
                    }
                    }
                }

                return Ok(listResponse);
                
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
