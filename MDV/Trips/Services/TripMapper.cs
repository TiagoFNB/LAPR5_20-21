using DDDNetCore.Trips.Domain;
using DDDNetCore.Trips.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DDDNetCore.Trips.Services
{
    public class TripMapper : ITripMapper
    {

        public Trip MapFromRegisterTripDtoToDomain(RegisterTripsDto registerTripDto)
        {
            Trip trip;
            if (registerTripDto.Key == null)
            {
                trip = new Trip(registerTripDto.PathId, registerTripDto.LineId, registerTripDto.PassingTimes);
            }
            else
            {
                trip = new Trip(registerTripDto.Key,registerTripDto.PathId, registerTripDto.LineId, registerTripDto.PassingTimes);
            }

            return trip;
        }
        
        public ResponseTripDto MapFromDomain2Dto(Trip trip)
        {
            ResponseTripDto registerTripDto = new ResponseTripDto(trip.Id.AsString(),trip.Path.Path, trip.Line.Line, trip.PassingTimes);

            return registerTripDto;
        }

    }
}
