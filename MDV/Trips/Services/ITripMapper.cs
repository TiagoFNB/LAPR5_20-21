using DDDNetCore.Trips.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DDDNetCore.Trips.Domain;

namespace DDDNetCore.Trips.Services
{
    public interface ITripMapper
    {
        public Trip MapFromRegisterTripDtoToDomain(RegisterTripsDto registerTripDto);
        public ResponseTripDto MapFromDomain2Dto(Trip trip);
    }
}
