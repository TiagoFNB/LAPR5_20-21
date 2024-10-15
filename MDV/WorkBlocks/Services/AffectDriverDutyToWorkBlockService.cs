using DDDNetCore.DriverDuties.Dto;
using DDDNetCore.WorkBlocks.Domain;
using DDDNetCore.WorkBlocks.Domain.ValueObjects;
using DDDNetCore.WorkBlocks.Dto;
using DDDNetCore.WorkBlocks.Mappers;
using DDDNetCore.WorkBlocks.Repository;
using DDDSample1.Domain.Shared;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DDDNetCore.WorkBlocks.Services
{
    public class AffectDriverDutyToWorkBlockService : IAffectDriverDutyToWorkBlockService
    {


        private readonly IWorkBlockRepository _repo;
        private readonly IWorkBlockMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;

        public AffectDriverDutyToWorkBlockService(IWorkBlockRepository repo,
            IWorkBlockMapper mapper, IUnitOfWork unitOfWork)
        {
            this._repo = repo;
            this._mapper = mapper;
            this._unitOfWork = unitOfWork;
        }

        public async Task<List<ReplyWorkBlockDto>> AffectDriverDuty(DriverDutyPlannedResponseDto dto)
        {
            List<ReplyWorkBlockDto> ListOfWorkBlocksAffectedByDriverDuty = new List<ReplyWorkBlockDto>();
            foreach (string ddWb in dto.TriedToAffectedWorkBlockList)
            {
 
            WorkBlock wb = await this._repo.GetByIdAsync(new WorkBlockCode(ddWb));
             if (wb != null) { 
                if (wb.DriverDutyCode == null)
                {
                   
               

                wb.DefineDriverDuty(dto.DriverDutyCode);
                this._repo.UpdateWorkBlock(wb);
                    await this._unitOfWork.CommitAsync();

                    var WbDto=  this._mapper.MapFromDomain2Dto(wb);

                ListOfWorkBlocksAffectedByDriverDuty.Add(WbDto);
                }
             }
            }


            return ListOfWorkBlocksAffectedByDriverDuty;
        }
    }
}
