using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using DDDNetCore.Drivers.Domain;
using DDDNetCore.Drivers.Dto;
using DDDNetCore.Drivers.Mappers;
using DDDNetCore.Drivers.Repository;
using DDDSample1.Domain.Shared;

namespace DDDNetCore.Drivers.Services
{
    public class DriverService : IDriverService
    {

        private readonly IUnitOfWork _unitOfWork;
        private readonly IHttpClientFactory _clientFactory;
        private readonly IDriverRepository _repoDrivers;
        private readonly IDriverMapper _mapper;

        public DriverService(IUnitOfWork unitOfWork, IDriverRepository repoDrivers, IDriverMapper mapper, IHttpClientFactory clientFactory)
        {
            this._unitOfWork = unitOfWork;

            this._repoDrivers = repoDrivers;
            this._mapper = mapper;
            this._clientFactory = clientFactory;
        }


        public async Task<DriverDto> AddAsync(string token, DriverDto dto)
        {
            var globalValidation = await VerifyDriverType(token, dto.Type);

            if (globalValidation == false)
            {
                throw new InvalidOperationException("That type of driver does not exist !");
            }


            Driver v = _mapper.MapFromDriverDtoToDomain(dto);

            await this._repoDrivers.AddAsync(v);

            await this._unitOfWork.CommitAsync();

            // CreateRoleDto createRoleDto = _mapper.(user);

            return _mapper.MapFromDomain2Dto(v);



        }

        private async Task<bool> VerifyDriverType(string token, string type)
        {

            var request = new HttpRequestMessage(HttpMethod.Get,
                "drivertype/" + type);
            var tok = token.Split(" ");

            request.Headers.Authorization = new AuthenticationHeaderValue(tok[0], tok[1]);
            var client = _clientFactory.CreateClient("mdr");
            var response = await client.SendAsync(request);

            if (response.StatusCode == HttpStatusCode.OK)
            {
                return true;
            }
            else
            {
                return false;
            }

        }


        public async Task<List<DriverDto>> FilterBy(string id)
        {
            

           List<Driver> list = await this._repoDrivers.filterById(id);

            if(list==null || list.Count == 0)
            {
                return null;
            }

            //Driver d = list.First();
            // List<DriverDto> listDto = new List<DriverDto>();

            //foreach(Driver d in list)
            //{
            //    _mapper.MapFromDomain2Dto(d);
            //}

           List<DriverDto> result = list.Select(driver => _mapper.MapFromDomain2Dto(driver)).ToList();
            // CreateRoleDto createRoleDto = _mapper.(user);

            return result;



        }

        public async Task<List<DriverDto>> ObtainAllDrivers()
        {

            List<Driver> list = await this._repoDrivers.GetAllAsync();

            if (list == null || list.Count == 0)
            {
                return null;
            }

            //Driver d = list.First();
            // List<DriverDto> listDto = new List<DriverDto>();

            //foreach(Driver d in list)
            //{
            //    _mapper.MapFromDomain2Dto(d);
            //}

            List<DriverDto> result = list.Select(driver => _mapper.MapFromDomain2Dto(driver)).ToList();
            // CreateRoleDto createRoleDto = _mapper.(user);

            return result;

        }

    }
}
