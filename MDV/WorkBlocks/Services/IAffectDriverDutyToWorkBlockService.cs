using DDDNetCore.DriverDuties.Dto;
using DDDNetCore.WorkBlocks.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DDDNetCore.WorkBlocks.Services
{
    public interface IAffectDriverDutyToWorkBlockService
    {
        public Task<List<ReplyWorkBlockDto>> AffectDriverDuty(DriverDutyPlannedResponseDto dto);
    }
}
