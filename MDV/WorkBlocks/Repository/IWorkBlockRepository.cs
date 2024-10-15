using DDDNetCore.VehicleDuties.Domain.ValueObjects;
using DDDNetCore.WorkBlocks.Domain;
using DDDNetCore.WorkBlocks.Domain.ValueObjects;
using DDDNetCore.WorkBlocks.Dto;
using DDDSample1.Domain.Shared;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DDDNetCore.WorkBlocks.Repository
{
    public interface IWorkBlockRepository : IRepository<WorkBlock, WorkBlockCode>
    {
        public Task<List<WorkBlock>> GetAllByVehicleDutyAsync(VehicleDutyCode id);

        public Task AddRangeAsync(List<WorkBlock> wks);

        public Task<List<WorkBlock>> GetAllWorkBlocksAsync();

        public Task<List<WorkBlock>> GetListWorkBlocksByVehicleDutyAsync(string id);

        public Task<List<WorkBlock>> GetListWorkBlocksByDriverDutyAsync(string id);

        public WorkBlock UpdateWorkBlock(WorkBlock wb);
    }
}
