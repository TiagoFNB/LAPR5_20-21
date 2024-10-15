using DDDNetCore.WorkBlocks.Domain;
using DDDNetCore.WorkBlocks.Dto;
using DDDNetCore.WorkBlocks.Mappers;
using DDDNetCore.WorkBlocks.Repository;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DDDNetCore.WorkBlocks.Services
{
    public class GetListWorkBlocksByVehicleDutyService : IGetListWorkBlocksByVehicleDutyService
    {
        private readonly IWorkBlockRepository _repo;
        private readonly IWorkBlockMapper _mapper;

        public GetListWorkBlocksByVehicleDutyService(IWorkBlockRepository repo,
            IWorkBlockMapper mapper)
        {
            this._repo = repo;
            this._mapper = mapper;
        }

        public async Task<List<ReplyWorkBlockDto>> GetAllAsync(string id)
        {
            List<WorkBlock> list = await this._repo.GetListWorkBlocksByVehicleDutyAsync(id);

            List<ReplyWorkBlockDto> newDtoList = new List<ReplyWorkBlockDto>();
            foreach (var workblock in list)
            {
                newDtoList.Add(_mapper.MapFromDomain2Dto(workblock));
            }


            return newDtoList;
        }
    }
}
