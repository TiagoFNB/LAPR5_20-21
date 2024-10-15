using DDDNetCore.Trips.Domain.ValueObjects;
using DDDNetCore.Trips.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace DDDNetCore.Trips.Controllers
{

    [Route("mdvapi/trip/line")]
    [ApiController]
    public class GetTripsByLine : ControllerBase
    {

        private readonly IListTripsByLineService _service;

        public GetTripsByLine(IListTripsByLineService service)
        {
            _service = service;
        }

        //Method get for trips request
        [HttpGet("{id}")]
        [Authorize(Roles = "User,Manager,Admin")]
        public async Task<IActionResult> ListByLine(string id)
        {
            var x = await _service.GetByLineAsync(id);
            return Ok(x);
        }
    }
}
