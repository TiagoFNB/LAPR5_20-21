using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text.Json;
using System.Threading.Tasks;
using DDDNetCore.Trips.Domain;
using DDDNetCore.Trips.DTO;
using DDDNetCore.Trips.Repository;
using DDDNetCore.Utils.Jwt;
using DDDNetCore.Vehicles.Domain;
using DDDSample1.Domain.Shared;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using System.Linq;

namespace DDDNetCore.Trips.Services
{
    public class RegisterTripService : IRegisterTripService
    {
        private readonly IHttpClientFactory _clientFactory;
        private readonly IUnitOfWork _unitOfWork;
        private readonly ITripRepository _repo;
        private readonly ITripMapper _mapper;

        public RegisterTripService(IHttpClientFactory clientFactory, IUnitOfWork unitOfWork, ITripRepository repo,
            ITripMapper mapper)
        {
            this._clientFactory = clientFactory;
            this._unitOfWork = unitOfWork;
            this._repo = repo;
            this._mapper = mapper;
        }

        public async Task<List<ResponseTripDto>> AddAsync(string tok, RegisterTripsDto dto)
        {
            //Obtain path that was refer in the request
            var response = await VerifyPath(tok, dto.PathId);

            //verify if response isnt null
            if (response == null)
            {
                throw new InvalidOperationException("The path id indicated does not exist !");
            }

            PathDto responsePathDto;
            try
            {
                using var responseStream = await response.Content.ReadAsStreamAsync();
                //Transforms response in PathDto
                responsePathDto = await JsonSerializer.DeserializeAsync<PathDto>(responseStream);
            }
            catch (Exception err)
            {
                throw new InvalidOperationException("The path id indicated does not exist !");
            }

            if (responsePathDto != null)
            {
                if (dto.LineId != responsePathDto.line) //Compares line from pathDto to line refered in the request
                {
                    throw new InvalidOperationException(
                        "The path id indicated does not belong to the line indicated !");
                }
            }
            else
            {
                throw new InvalidOperationException("The path id indicated does not exist !");
            }


            //Get all paths from line refered in the request
            PathsFromLineDto responsePathsFromLine = await GetListPaths(tok, dto.LineId);

            //Obtain path type and its reverse type
            string typePath = responsePathDto.type;
            string typeReversePath;
            if (typePath == "Go")
            {
                typeReversePath = "Return";
            }
            else
            {
                typeReversePath = "Go";
            }

            //Obtain the reverse paths possible, filtering the list of paths possible
            List<PathDto> filteredPaths = new List<PathDto>();
            foreach (var path in responsePathsFromLine.paths)
            {
                if (path.type == typeReversePath)
                {
                    filteredPaths.Add(path);
                }
            }

            //Obtain the reverse path possible
            //Obtaining only the paths possible that start at the end of the path requested and ends where it begins
            List<PathDto> filteredReversePaths = new List<PathDto>();
            if (filteredPaths.Count != 0)
            {
                foreach (var path in filteredPaths)
                {
                    if (responsePathDto.pathSegments[0].node1 == path.pathSegments[path.pathSegments.Length - 1].node2
                        && path.pathSegments[0].node1 ==
                        responsePathDto.pathSegments[responsePathDto.pathSegments.Length - 1].node2)
                    {
                        filteredReversePaths.Add(path);
                    }
                }
            }

            //This verification will allow to only create exclusive Go or Return Trips if there isn't a reverse path for it
            if (filteredReversePaths.Count == 0)
            {
                filteredReversePaths.Add(responsePathDto);
            }

            PathDto[] listGoAndReturn = {responsePathDto, filteredReversePaths[0]};


            List<Trip> listNewTrips = new List<Trip>();

            List<Trip> newTrips;

            //Verify if it's a multiple request for trips or a trip a doc
            if (dto.EndTime != 0 && dto.Frequency != 0 && dto.Key == null)
            {
                int flag = 0;
                var temp = dto.StartingTime; //Save starting time of each trip
                var freq = dto.Frequency; //Use freq as a variable, just to avoid confusion

                while (temp < dto.EndTime)
                {
                    newTrips = await CalculatePassingTimes(listGoAndReturn, temp, dto.EndTime);

                    listNewTrips.AddRange(newTrips);
                    //add startingTime with frequency to obtain new startingTime
                    temp += freq;
                }
            }
            else
            {
                //End time will be one second after the starting to only allow creation of trip adoc
                newTrips = await CalculatePassingTimesForAdHoc(dto, listGoAndReturn[0], dto.StartingTime);
                listNewTrips.AddRange(newTrips);
            }


            List<ResponseTripDto> listDtoToReturn = new List<ResponseTripDto>();
            foreach (var v in listNewTrips)
            {
                await this._repo.AddAsync(v);

                await this._unitOfWork.CommitAsync();

                listDtoToReturn.Add(_mapper.MapFromDomain2Dto(v));
            }


            return listDtoToReturn;
        }

        private async Task<HttpResponseMessage> VerifyPath(string token, string path)
        {
            var request = new HttpRequestMessage(HttpMethod.Get,
                "path/" + path);
            var tok = token.Split(" ");

            request.Headers.Authorization = new AuthenticationHeaderValue(tok[0], tok[1]);
            var client = _clientFactory.CreateClient("mdr");
            var response = await client.SendAsync(request);

            if (response.StatusCode == HttpStatusCode.OK)
            {
                return response;
            }
            else
            {
                return null;
            }
        }

        private async Task<PathsFromLineDto> GetListPaths(string token, string line)
        {
            var request = new HttpRequestMessage(HttpMethod.Get,
                "line/paths/" + line);
            var tok = token.Split(" ");

            request.Headers.Authorization = new AuthenticationHeaderValue(tok[0], tok[1]);
            var client = _clientFactory.CreateClient("mdr");
            var response = await client.SendAsync(request);
            PathsFromLineDto dto;
            if (response.StatusCode == HttpStatusCode.OK)
            {

                using var responseStream = await response.Content.ReadAsStreamAsync();

                dto = await JsonSerializer.DeserializeAsync<PathsFromLineDto>(responseStream);

                if (dto != null)
                {
                    foreach (var path in dto.paths)
                    {
                        path.line = line;
                    }
                }

                return dto;
            }
            else
            {
                return null;
            }
        }

        private async Task<List<Trip>> CalculatePassingTimes(PathDto[] listGoAndReturnPaths, int time, int endTime)
        {
            List<Trip>
                listToReturnWithDomainTrips = new List<Trip>();

            int flag = 0;
            bool exists = false;
            List<int> ListPassing;
            //Verify if there's already a trip to the specific path from line at the same starting time
            while (time < endTime)
            {
                //Verify if trip exists in database for the specifc time with the respective path
                var result = this._repo
                    .GetListTripsFromPathByTime(listGoAndReturnPaths[flag].key, listGoAndReturnPaths[flag].line, time)
                    .Result;
                foreach (var trip in result)
                {
                    if (trip.PassingTimes[0].Time == time)
                    {
                        exists = true;
                    }
                }


                //Initialize list of passing times
                ListPassing = new List<int>();

                ListPassing.Add(time);

                int startTime = time;
                //uSELESS initialization 
                //var old = ListPassing[0];

                //For each segment of the path 
                foreach (var pathSeg in listGoAndReturnPaths[flag].pathSegments)
                {
                    //old = ListPassing[ListPassing.Count - 1]; //Saves old passing time
                    //ListPassing.Add(old + pathSeg.duration); //adds duration of segment + old time
                    time += pathSeg.duration;
                    ListPassing.Add(time);
                }

                //Adds list to the new dto and the rest of parameters
                RegisterTripsDto tripDto = new RegisterTripsDto(listGoAndReturnPaths[flag].key,
                    listGoAndReturnPaths[flag].line, startTime, 0, 0);
                tripDto.PassingTimes = ListPassing;
                if (!exists)
                {
                    //Maps Dto to Domain
                    Trip v = _mapper.MapFromRegisterTripDtoToDomain(tripDto);

                    //Add trip to list of return
                    listToReturnWithDomainTrips.Add(v);
                }

                exists = false;
                //switch value between 0 and 1 in order to change 
                flag = (flag == 0 ? 1 : 0);
            }

            return listToReturnWithDomainTrips;
        }



        private async Task<List<Trip>> CalculatePassingTimesForAdHoc(RegisterTripsDto dto, PathDto path, int time)
        {
            List<Trip>
                listToReturnWithDomainTrips = new List<Trip>();
            bool exists = false;
            List<int> ListPassing;

            var result = this._repo
                .GetListTripsFromPathByTime(path.key, path.line, time)
                .Result;
            foreach (var trip in result)
            {
                if (trip.PassingTimes[0].Time == time)
                {
                    exists = true;
                }
            }

            if (!exists)
            {
                ListPassing = new List<int>();

                ListPassing.Add(time);

                int startTime = time;

                //For each segment of the path 
                foreach (var pathSeg in path.pathSegments)
                {
                    //old = ListPassing[ListPassing.Count - 1]; //Saves old passing time
                    //ListPassing.Add(old + pathSeg.duration); //adds duration of segment + old time
                    time += pathSeg.duration;
                    ListPassing.Add(time);
                }


                dto.PassingTimes = ListPassing;

                Trip v = _mapper.MapFromRegisterTripDtoToDomain(dto);

                listToReturnWithDomainTrips.Add(v);
            }

            return listToReturnWithDomainTrips;
        }
    }
    



}