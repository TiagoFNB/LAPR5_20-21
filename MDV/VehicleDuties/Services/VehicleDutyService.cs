using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using DDDNetCore.VehicleDuties.Domain;
using DDDNetCore.VehicleDuties.Dto;
using DDDNetCore.VehicleDuties.Mappers;
using DDDNetCore.VehicleDuties.Repository;
using DDDNetCore.Vehicles.Domain;
using DDDNetCore.Vehicles.Repository;
using DDDNetCore.Vehicles.ValueObjects;
using DDDSample1.Domain.Shared;

namespace DDDNetCore.VehicleDuties.Services
{
    public class VehicleDutyService : IVehicleDutyService
    {

        private readonly IUnitOfWork _unitOfWork;
        private readonly IVehicleDutyRepository _repoVehicleDuties;
        private readonly IVehicleRepository _repoVehicles;
        private readonly IVehicleDutyMapper _mapper;

        public VehicleDutyService(IUnitOfWork unitOfWork, IVehicleRepository repoVehicles, IVehicleDutyRepository repoVehicleDuties, IVehicleDutyMapper mapper)
        {
            this._unitOfWork = unitOfWork;
            this._repoVehicleDuties = repoVehicleDuties;
            this._mapper = mapper;
            this._repoVehicles = repoVehicles;
        }


        /**
         * Adds a new VehicleDuty to the database
         * 
         * @param dto - Vehicle Duty DTO
         * 
         */
        public async Task<VehicleDutyDto> AddAsync( VehicleDutyDto dto)
        {
            if (dto.VehicleLicense != null)
            {
                if (!await VerifyVehicle(dto.VehicleLicense))
                {
                    throw new InvalidOperationException("That vehicle does not exist !");
                }

            }
           

            VehicleDuty vehicleDuty = _mapper.MapFromVehicleDutyDtoToDomain(dto);

            vehicleDuty = await this._repoVehicleDuties.AddAsync(vehicleDuty);

            await this._unitOfWork.CommitAsync();

            return _mapper.MapFromDomain2Dto(vehicleDuty);
        }

        /**
         * Verifies if the vehicle exists, true if it exists, false if not
         * 
         * @param license - Vehicle License associated to the Vehicle Duty
         */
        private async Task<bool> VerifyVehicle(string license)
        {
            Vehicle obj = await _repoVehicles.GetByIdAsync(new VehicleLicense(license));
            return (obj != null);
        }

    }
}
