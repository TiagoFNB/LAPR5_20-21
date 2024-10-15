using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DDDNetCore.Trips.DTO;

namespace DDDNetCore.Trips.Services
{
    public interface IListTripsService
    {
        public Task<List<ResponseTripDto>> GetAllAsync();
    }
}
