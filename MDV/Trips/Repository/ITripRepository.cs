using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DDDNetCore.Trips.Domain;
using DDDNetCore.Trips.Domain.ValueObjects;
using DDDSample1.Domain.Shared;

namespace DDDNetCore.Trips.Repository
{
    public interface ITripRepository : IRepository<Trip, TripKey>
    {
        public Task<List<Trip>> GetListTripsFromPathByTime(string path, string line, int startingTime);

        public Task<List<Trip>> GetByLineAsync(LineId lineId);
    }
}
