using DDDNetCore.Drivers.Domain;
using DDDNetCore.Drivers.Dto;
using DDDNetCore.Drivers.Repository;
using DDDNetCore.Drivers.Services;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;

namespace DDDNetCore.Drivers.Controllers
{
    [Route("mdvapi/Driver")]
    [ApiController]
    public class ObtainDriversControler : ControllerBase
    {
        private readonly IDriverService _service;




        public ObtainDriversControler(IDriverService service)
        {
            _service = service;
        }


        [HttpGet("{id}")]
        [Authorize(Roles = "User,Manager,Admin")]
        public async Task<IActionResult> FilterDrivers(string id)
        {
            var x =  await _service.FilterBy(id);
            return Ok(x);

        }


        [HttpGet]
        [Authorize(Roles = "User,Manager,Admin")]
        public async Task<IActionResult> ObtainAllDrivers()
        {
            var x = await _service.ObtainAllDrivers();
            if (x != null)
            {
                if (x.Count != 0)
                {
                    return Ok(x);
                }
            }
           
            return BadRequest("There are no Drivers");
        }


    }
}
