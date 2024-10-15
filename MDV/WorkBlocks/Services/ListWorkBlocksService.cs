using DDDNetCore.WorkBlocks.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DDDNetCore.WorkBlocks.Domain;
using DDDNetCore.WorkBlocks.Mappers;
using DDDNetCore.WorkBlocks.Repository;
using DDDSample1.Domain.Shared;

namespace DDDNetCore.WorkBlocks.Services
{
    public class ListWorkBlocksService : IListWorkBlocksService
    {
        private readonly IWorkBlockRepository _repo;
        private readonly IWorkBlockMapper _mapper;

        public ListWorkBlocksService(IWorkBlockRepository repo,
            IWorkBlockMapper mapper)
        {
            this._repo = repo;
            this._mapper = mapper;
        }
        
        public async Task<List<ReplyWorkBlockDto>> GetAllAsync()
        {
            List<WorkBlock> list = await this._repo.GetAllWorkBlocksAsync();

            List<ReplyWorkBlockDto> newDtoList = new List<ReplyWorkBlockDto>();
            foreach (var workblock in list)
            {
                newDtoList.Add(_mapper.MapFromDomain2Dto(workblock));
            }
           

            return newDtoList;
        }
    }
}
