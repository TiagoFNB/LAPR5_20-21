using DDDNetCore.Drivers.Repository;
using DDDNetCore.DriverDuties.Dto;
using DDDNetCore.DriverDuties.Mappers;
using DDDNetCore.DriverDuties.Repository;
using DDDSample1.Domain.Shared;
using System;
using System.Threading.Tasks;
using DDDNetCore.Drivers.Domain.ValueObjects;
using DDDNetCore.Drivers.Domain;
using DDDNetCore.DriverDuties.Domain;
using DDDNetCore.WorkBlocks.Services;
using System.Collections.Generic;

namespace DDDNetCore.DriverDuties.Services
{
    public class DriverDutyService : IDriverDutyService
    {

        private readonly IUnitOfWork _unitOfWork;
        private readonly IDriverDutyRepository _repoDriverServices;
        private readonly IDriverRepository _repoDrivers;
        private readonly IDriverDutyMapper _mapper;
        private readonly IAffectDriverDutyToWorkBlockService _affectWrockBlockSerivce;

        public DriverDutyService(IUnitOfWork unitOfWork, IAffectDriverDutyToWorkBlockService affectDriverDutyToWorkBlockService, IDriverRepository repoDrivers, IDriverDutyRepository repoDriverServices, IDriverDutyMapper mapper)
        {
            this._unitOfWork = unitOfWork;
            this._repoDriverServices = repoDriverServices;
            this._mapper = mapper;
            this._repoDrivers = repoDrivers;
            this._affectWrockBlockSerivce = affectDriverDutyToWorkBlockService;
        }


        /**
         * Adds a new driver duty to the database
         * 
         * @param dto - Driver Duty DTO
         * @param token - Authentication token
         */
        public async Task<DriverDutyDto> AddAsync(DriverDutyDto dto)
        {
            if (dto.DriverMecNumber != null)
            {
                if (!await VerifyDriver(dto))
                {
                    throw new InvalidOperationException("That driver does not exist !");
                }
            }
            

            DriverDuty driverDuty = _mapper.MapFromDriverDutyDtoToDomain(dto);

            driverDuty = await this._repoDriverServices.AddAsync(driverDuty);

            await this._unitOfWork.CommitAsync();

            return _mapper.MapFromDomain2Dto(driverDuty);
        }



        public async Task<DriverDutyPlannedResponseDto> AddPlannedDriverDutyAsync(DriverDutyPlannedDto dto)
        {
           

                if (dto.DriverMecNumber != null)
                {
                    DriverDutyDto d = new DriverDutyDto(null, dto.DriverMecNumber);
                    if (!await VerifyDriver(d))
                    {
                        throw new InvalidOperationException("That driver does not exist !");
                    }
                }



                DriverDuty driverDuty = _mapper.MapFromDriverDutyPlannedDtoToDomain(dto);

                driverDuty = await this._repoDriverServices.AddAsync(driverDuty);



                var responseDto = _mapper.MapFromDomain2PlannedDto(driverDuty, dto);

                var affectedWorkBlockList = await _affectWrockBlockSerivce.AffectDriverDuty(responseDto);

                responseDto.DefineAffectedWorkBlocks(affectedWorkBlockList);


                if (affectedWorkBlockList.Count != 0)
                {
                    await this._unitOfWork.CommitAsync();  // only save the driver duty if there were workBlocks affected by it
                }

                
            

            return responseDto;
        

        }

        /**
         * Verifies if the driver exists, true if it exists, false if not
         * 
         * @param driverCode - Driver Code associated to the Driver Duty
         */
        private async Task<bool> VerifyDriver(DriverDutyDto dto)
        {
            Driver obj = await _repoDrivers.GetByIdAsync(new DriverMechanographicNumber(dto.DriverMecNumber));
            return (obj != null);
        }

    

    }
}
