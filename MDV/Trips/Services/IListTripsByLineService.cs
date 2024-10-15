using DDDNetCore.Trips.DTO;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DDDNetCore.Trips.Services
{
    public interface IListTripsByLineService
    {
        public Task<List<ResponseTripDto>> GetByLineAsync(string id);
    }
}
