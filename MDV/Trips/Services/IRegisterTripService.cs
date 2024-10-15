using DDDNetCore.Trips.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DDDNetCore.Trips.Services
{
    public interface IRegisterTripService
    {
        public Task<List<ResponseTripDto>> AddAsync(string tok, RegisterTripsDto dto);
        
    }
}
