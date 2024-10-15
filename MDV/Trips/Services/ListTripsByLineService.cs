using DDDNetCore.Trips.Domain;
using DDDNetCore.Trips.Domain.ValueObjects;
using DDDNetCore.Trips.DTO;
using DDDNetCore.Trips.Repository;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DDDNetCore.Trips.Services
{
    public class ListTripsByLineService : IListTripsByLineService
    {

        private readonly ITripRepository _repo;
        private readonly ITripMapper _mapper;
        public ListTripsByLineService(ITripRepository repo,ITripMapper mapper)
        {
            this._repo = repo;
            this._mapper = mapper;
        }

        public async Task<List<ResponseTripDto>> GetByLineAsync(string id)
        {
            List<Trip> list = await this._repo.GetByLineAsync(new LineId(id));

            List<ResponseTripDto> result = list.Select(trip => _mapper.MapFromDomain2Dto(trip)).ToList();

            return result;
        }
    }
}
