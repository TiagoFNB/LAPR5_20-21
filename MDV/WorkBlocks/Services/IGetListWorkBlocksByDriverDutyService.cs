using DDDNetCore.WorkBlocks.Dto;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DDDNetCore.WorkBlocks.Services
{
    public interface IGetListWorkBlocksByDriverDutyService
    {
        public Task<List<ReplyWorkBlockDto>> GetAllAsync(string id);
    }
}
