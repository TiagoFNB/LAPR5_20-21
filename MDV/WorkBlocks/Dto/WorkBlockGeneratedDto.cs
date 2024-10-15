
using DDDNetCore.WorkBlocks.Domain;
using System.Diagnostics;

namespace DDDNetCore.WorkBlocks.Dto
{
    public class WorkBlockGeneratedDto
    {
        /**
         * Result Message to return after generating multiple workblocks
         */
        public WorkBlockDto[] Wks { get; private set; }

        public WorkBlockGeneratedDto(WorkBlockDto[] wks)
        {
            this.Wks = wks;
        }
    }
}
