using DDDNetCore.WorkBlocks.Domain;
using DDDNetCore.WorkBlocks.Domain.ValueObjects;
using DDDNetCore.WorkBlocks.Dto;
using DDDNetCore.WorkBlocks.Mappers;
using DDDNetCore.WorkBlocks.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DDDNetCore.WorkBlocks.Services
{
    public class GetWorkBlockByIdService : IGetWorkBlockByIdService
    {

        private readonly IWorkBlockRepository _repo;
        private readonly IWorkBlockMapper _mapper;

        public GetWorkBlockByIdService(IWorkBlockRepository repo,
            IWorkBlockMapper mapper)
        {
            this._repo = repo;
            this._mapper = mapper;
        }


        public async Task<ReplyWorkBlockDto> GetAsync(string id)
        {
            WorkBlock wb = await this._repo.GetByIdAsync(new WorkBlockCode(id));

            if (wb != null)
            {
                ReplyWorkBlockDto dto = _mapper.MapFromDomain2Dto(wb);
                return dto;
            }
            return null;

            
        }


    }
}
