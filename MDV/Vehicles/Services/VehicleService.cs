using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using DDDNetCore.Vehicles.Domain;
using DDDNetCore.Vehicles.Dto;
using DDDNetCore.Vehicles.Mappers;
using DDDNetCore.Vehicles.Repository;
using DDDSample1.Domain.Roles;
using DDDSample1.Domain.Shared;

namespace DDDNetCore.Vehicles.Services
{
    public class VehicleService : IVehicleService
    {

        private readonly IUnitOfWork _unitOfWork;
        private readonly IHttpClientFactory _clientFactory;
        private readonly IVehicleRepository _repoVehicles;
        private readonly IVehicleMapper _mapper;

        public VehicleService(IUnitOfWork unitOfWork, IVehicleRepository repoVehicles, IVehicleMapper mapper , IHttpClientFactory clientFactory)
        {
            this._unitOfWork = unitOfWork;

            this._repoVehicles = repoVehicles;
            this._mapper = mapper;
            this._clientFactory = clientFactory;
        }


        public async Task<VehicleDto> AddAsync(string token,VehicleDto dto)
        {
            var globalValidation = await VerifyVehicleType(token,dto.Type);

            if (globalValidation == false)
            {
                throw new InvalidOperationException("That type of vehicle does not exist !");
            }


            Vehicle v = _mapper.MapFromVehicleDtoToDomain(dto);

            await this._repoVehicles.AddAsync(v);

            await this._unitOfWork.CommitAsync();

            // CreateRoleDto createRoleDto = _mapper.(user);

            return _mapper.MapFromDomain2Dto(v);



        }

        private async Task<bool> VerifyVehicleType(string token,string type)
        {

            var request = new HttpRequestMessage(HttpMethod.Get,
                "vehicleType/"+type);
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

        public async Task<List<VehicleDto>> GetAll()
        {

            List<Vehicle> list = await this._repoVehicles.GetAllAsync();

            if (list == null || list.Count == 0)
            {
                return null;
            }

            List<VehicleDto> result = list.Select(vehicle => _mapper.MapFromDomain2Dto(vehicle)).ToList();
            
            return result;



        }

    }
}
