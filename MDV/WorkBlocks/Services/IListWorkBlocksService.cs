using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DDDNetCore.WorkBlocks.Dto;

namespace DDDNetCore.WorkBlocks.Services
{
    public interface IListWorkBlocksService
    {
        public Task<List<ReplyWorkBlockDto>> GetAllAsync();
    }
}
