using DDDNetCore.Trips.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DDDNetCore.Drivers.Dto;
using DDDNetCore.Trips.Domain;
using DDDNetCore.Trips.Repository;
using DDDSample1.Domain.Shared;

namespace DDDNetCore.Trips.Services
{
    public class ListTripsService : IListTripsService
    {
        private readonly ITripRepository _repo;
        private readonly ITripMapper _mapper;
        
        public ListTripsService(IUnitOfWork unitOfWork, ITripRepository repo,
            ITripMapper mapper)
        { 
            this._repo = repo;
            this._mapper = mapper;
        }
        public async Task<List<ResponseTripDto>> GetAllAsync()
        {
            List<Trip> list = await this._repo.GetAllAsync();

            List<ResponseTripDto> result = list.Select(trip => _mapper.MapFromDomain2Dto(trip)).ToList();

            return result;
        }
    }
}
