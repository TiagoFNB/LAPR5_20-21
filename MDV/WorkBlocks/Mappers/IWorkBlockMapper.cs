using DDDNetCore.WorkBlocks.Domain;
using DDDNetCore.WorkBlocks.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DDDNetCore.WorkBlocks.Mappers
{
    public interface IWorkBlockMapper
    {
        public WorkBlockGeneratedDto MapFromDomainToGeneratedDto(ICollection<WorkBlock> workBlocks);

        public ReplyWorkBlockDto MapFromDomain2Dto(WorkBlock wb);
    }
}
