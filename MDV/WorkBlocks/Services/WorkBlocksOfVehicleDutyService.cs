using DDDNetCore.Lines.Dto;
using DDDNetCore.Lines.Mappers;
using DDDNetCore.Trips.Domain;
using DDDNetCore.Trips.Domain.ValueObjects;
using DDDNetCore.Trips.Repository;
using DDDNetCore.VehicleDuties.Domain;
using DDDNetCore.VehicleDuties.Domain.ValueObjects;
using DDDNetCore.VehicleDuties.Repository;
using DDDNetCore.Vehicles.Domain;
using DDDNetCore.Vehicles.Repository;
using DDDNetCore.Vehicles.ValueObjects;
using DDDNetCore.WorkBlocks.Domain;
using DDDNetCore.WorkBlocks.Dto;
using DDDNetCore.WorkBlocks.Repository;
using DDDSample1.Domain.Shared;
using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using System.Linq;
using DDDNetCore.WorkBlocks.Mappers;

namespace DDDNetCore.WorkBlocks.Services
{
    public class WorkBlocksOfVehicleDutyService : IWorkBlocksOfVehicleDutyService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IHttpClientFactory _clientFactory;
        private readonly ILineMapper _mapperLine;
        private readonly IWorkBlockMapper _mapperWorkBlock;
        private readonly IVehicleRepository _repoVehicles;
        private readonly IVehicleDutyRepository _repoVehicleDuties;
        private readonly ITripRepository _repoTrips;
        private readonly IWorkBlockRepository _repoWorkBlocks;

        public WorkBlocksOfVehicleDutyService(IUnitOfWork unitOfWork, IHttpClientFactory clientFactory, IVehicleRepository repoVehicles,
            IVehicleDutyRepository repoVehicleDuties, ITripRepository repoTrips, IWorkBlockRepository repoWorkBlocks,ILineMapper mapperLine, IWorkBlockMapper mapperWorkBlock)
        {
            this._unitOfWork = unitOfWork;
            this._clientFactory = clientFactory;
            this._repoVehicles = repoVehicles;
            this._repoVehicleDuties = repoVehicleDuties;
            this._repoTrips = repoTrips;
            this._repoWorkBlocks = repoWorkBlocks;
            this._mapperLine = mapperLine;
            this._mapperWorkBlock = mapperWorkBlock;
        }

        public async Task<WorkBlockGeneratedDto> AddAsync(String token,WorkBlockGeneratorDto dto)
        {
            
            //1º Determine if the vehicletype of this vehicleduty is allowed in the lines of each trip, otherwise return an error
            List<Trip> trips = await validateVehicleInLinesAsync(token,dto);

            List<WorkBlock> workBlocksOfDuty = await _repoWorkBlocks.GetAllByVehicleDutyAsync(new VehicleDutyCode(dto.VehicleDuty));

            uint amountOfBlocksToCreate;
            //2º Check if there are workblocks assigned to the vehicleduty
            if (workBlocksOfDuty.Count!=0)
            {
                DateTime date = workBlocksOfDuty[0].StartDateTime.DateTime;
                if(date.Day != dto.Date.Day && date.Month != dto.Date.Month && date.Year != dto.Date.Year)
                {
                    throw new Exception("The given Vehicle Duty already has WorkBlocks assigned to another day.");
                }
                //There are workblocks already assigned to this day in this vehicle duty, find out the earliest possible new workblock allocation
                else
                {
                    //Check from max to least amount of duration blocks to see how many there is space to create since the start time

                    Boolean thereIsSpace = false;
                    amountOfBlocksToCreate = dto.MaxBlocks;
                    DateTime fixedStart = dto.Date;

                    while (amountOfBlocksToCreate != 0 && !thereIsSpace)
                    {
                        thereIsSpace = true;

                        //Calculate ending with this amount of blocks
                        long seconds = amountOfBlocksToCreate * dto.MaxDuration;
                        DateTime hipothesisEnd = fixedStart.AddSeconds(seconds);

                        //Check for each workblock if the generated workblocks would occupy the same space or not
                        foreach (WorkBlock wk in workBlocksOfDuty){
                            if (!(fixedStart.TimeOfDay>=wk.EndDateTime.DateTime.TimeOfDay || hipothesisEnd.TimeOfDay<=wk.StartDateTime.DateTime.TimeOfDay)) {
                                thereIsSpace = false;
                            }
                        }
                        if (!thereIsSpace) { amountOfBlocksToCreate--; }
                    }
                }
            }
            //There are no workblocks assigned to this vehicleduty yet
            else
            {
                amountOfBlocksToCreate = dto.MaxBlocks;
            }

            //3º Calculate how many work blocks can be created according to vehicle duty time restrictions
            while (amountOfBlocksToCreate*dto.MaxDuration > 86400)
            {
                amountOfBlocksToCreate--;
            }

            if (amountOfBlocksToCreate == 0)
            {
                throw new Exception("No space to create any WorkBlock with the specified duration.");
            }

            //4º Create the work blocks
            List<WorkBlock> createdWbs = new List<WorkBlock>();
            DateTime newStartTime = dto.Date;

            for(;amountOfBlocksToCreate>0; amountOfBlocksToCreate--)
            {
                DateTime endTime = newStartTime.AddSeconds(dto.MaxDuration);
                WorkBlock wb = new WorkBlock(newStartTime,endTime, null, dto.VehicleDuty, new List<Trip>());
                newStartTime = endTime;
                createdWbs.Add(wb);
            }

            //5º Determine which trips will belong to each workblock and add them to each workblock's list

            List<Trip> notAffectedTrips = new List<Trip>(trips);    //Holds the trips that have not been affected to workblocks yet

            foreach(Trip trip in trips)
            {
                PassingTime tripStart = trip.PassingTimes.First();
                PassingTime tripEnd = trip.PassingTimes.Last();
                
                //Check if the schedules for the trips and workblocks overlap
                foreach(WorkBlock wk in createdWbs)
                {

                    //If the trip starts after workblock ends and ends before workblock ends
                    if((tripStart.Time>= wk.StartDateTime.DateTime.TimeOfDay.TotalSeconds && tripEnd.Time <= wk.EndDateTime.DateTime.TimeOfDay.TotalSeconds) 
                            //If the trip starts after workblock starts and starts before workblock ends
                            || (tripStart.Time >= wk.StartDateTime.DateTime.TimeOfDay.TotalSeconds && tripStart.Time <= wk.EndDateTime.DateTime.TimeOfDay.TotalSeconds)
                            // If the trip ends before workblock ends and ends after workblock start
                            || (tripEnd.Time <= wk.EndDateTime.DateTime.TimeOfDay.TotalSeconds && tripEnd.Time >= wk.StartDateTime.DateTime.TimeOfDay.TotalSeconds))
                    {
                        wk.addTrip(trip);   //Add trip to workblock
                        notAffectedTrips.Remove(trip);  //Remove trip from the list
                    }
                }    
            }

            //Check if all the trips were affected to workblocks
            if (notAffectedTrips.Count != 0)
            {
                Trip firstTrip = notAffectedTrips.First();
                TimeSpan time = TimeSpan.FromSeconds(firstTrip.PassingTimes.First().Time);
                string startingTime = string.Format(string.Format("{0:D2}h:{1:D2}m:{2:D2}s",time.Hours,time.Minutes,time.Seconds));

                throw new Exception("The trip of path: '" + firstTrip.Path.Path + "' starting at " + startingTime + " could not be affected to a workblock.");
            }

            await this._repoWorkBlocks.AddRangeAsync(createdWbs);

            await this._unitOfWork.CommitAsync();

            var x= this._mapperWorkBlock.MapFromDomainToGeneratedDto(createdWbs);
            return x;
        }


        /**
         * Validates that the vehicle is allowed in every given line
         * 
         * @param dto - Dto of WorkBlock Generator
         * @return List of trip instances to be associated with the workblocks
         */
        private async Task<List<Trip>> validateVehicleInLinesAsync(string token,WorkBlockGeneratorDto dto)
        {
          
            //Obtain the vehicle type
            VehicleType vt = await ObtainVehicleDutyVTypeAsync(dto);

            //Converts all the strings in the dto to TripKey objects
            List<TripKey> tripKeys = new List<TripKey>();
            foreach(string dtoTrip in dto.Trips)
            {
                tripKeys.Add(new TripKey(dtoTrip));
            }

            //Hold all the obtained trips here
            List<Trip> trips = await _repoTrips.GetByIdsAsync(tripKeys);
            if(trips.Count != tripKeys.Count)
            {
                throw new Exception("At least one of the inserted trips does not exist.");
            }

            //Holds all the lines that have been checked
            List<LineId> checkedLines = new List<LineId>();

            //Obtain all lines of the trips
            foreach(Trip trip in trips)
            {
                //Check if the line has already been obtained to avoid repetition and unecessary db calls
                if (!checkedLines.Contains(trip.Line))
                {

                    LineDto lineDto = await ObtainLine(token,trip.Line);
                    if (vt != null) // if vehicleduty is affected to a vehicle then it has vehicle type 
                    {

                    //Check if the vehicle type is allowed in this line
                    if (lineDto.AllowedVehicles.Count!=0 && !lineDto.AllowedVehicles.Contains(vt.Type))
                    {
                        throw new Exception("This vehicle is not allowed to perform trips in the line: " + lineDto.name + ".");
                    }
                    }
                    checkedLines.Add(trip.Line);
                }
            }

            return trips;

        }

        /**
         * Obtains the vehicle type of vehicle duty present in the given dto
         * 
         * @param dto Dto of WorkBlock Generator
         */
        private async Task<VehicleType> ObtainVehicleDutyVTypeAsync(WorkBlockGeneratorDto dto)
        {
            //Obtain the Vehicle Duty object from db
            VehicleDuty vd = await _repoVehicleDuties.GetByIdAsync(new VehicleDutyCode(dto.VehicleDuty));
            if (vd == null)
            {         
                throw new Exception("Vehicle Duty " + dto.VehicleDuty + " does not exist.");
            }
          
            //Obtain the vehicle object from db
            Vehicle v = await _repoVehicles.GetByIdAsync(vd.VehicleLicense);
            if (v == null)
            {
                return null;
                //throw new Exception("Vehicle with License: " + vd.VehicleLicense.AsString() + " does not exist.");
            }

            //Return the obtained vehicle type
            return v.Type;
        }

        /**
         * Obtains a line from MDR
         * 
         * @parameter line - Line Id
         * @paramter token - authorization
         */
        private async Task<LineDto> ObtainLine(string token, LineId line)
        {

            var request = new HttpRequestMessage(HttpMethod.Get,
                "/api/line/" + line.Line);
            var tok = token.Split(" ");

            request.Headers.Authorization = new AuthenticationHeaderValue(tok[0], tok[1]);
            var client = _clientFactory.CreateClient("mdr");
            var response = await client.SendAsync(request);

            if (response.StatusCode == HttpStatusCode.OK)
            {
                var res= await _mapperLine.MapFromMdrToDtoAsync(response.Content);
                return res;
            }
            else
            {
                throw new Exception("Internal error: A trip's line does not exist.");
            }

        }

    }
}
