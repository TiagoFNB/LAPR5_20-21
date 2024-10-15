using DDDNetCore.WorkBlocks.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DDDNetCore.WorkBlocks.Services
{
    public interface IGetWorkBlockByIdService
    {
        public Task<ReplyWorkBlockDto> GetAsync(string id);
    }
}
