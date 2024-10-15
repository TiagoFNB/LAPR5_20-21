using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using DDDNetCore.WorkBlocks.Services;
using DDDSample1.Controllers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DDDNetCore.WorkBlocks.Controllers
{
    [Route("mdvapi/WorkBlocks")]
    [ApiController]
    public class GetListWorkBlocksController : ControllerBase
    {
        private readonly IListWorkBlocksService _service;

        public GetListWorkBlocksController(IListWorkBlocksService service)
        {
            _service = service;
        }

        
        //Method get for workblocks request
        [HttpGet]
        [Authorize(Roles = "User,Manager,Admin")]
        public async Task<IActionResult> List()
        {

            try
            {
                var Dtos = await _service.GetAllAsync();
                return Ok(Dtos);
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
