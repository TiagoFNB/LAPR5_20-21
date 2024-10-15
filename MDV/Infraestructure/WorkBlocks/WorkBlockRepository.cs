using DDDNetCore.VehicleDuties.Domain.ValueObjects;
using DDDNetCore.WorkBlocks.Domain;
using DDDNetCore.WorkBlocks.Domain.ValueObjects;
using DDDNetCore.WorkBlocks.Repository;
using DDDSample1.Infrastructure;
using DDDSample1.Infrastructure.Shared;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;
using DDDNetCore.DriverDuties.Domain.ValueObjects;

namespace DDDNetCore.Infraestructure.WorkBlocks
{
    public class WorkBlockRepository : BaseRepository<WorkBlock, WorkBlockCode>, IWorkBlockRepository
    {
        private readonly DbSet<WorkBlock> _objs;
        public WorkBlockRepository(MDVDbContext context) : base(context.WorkBlocks)
        {
            this._objs = context.WorkBlocks;
        }

        public async Task<List<WorkBlock>> GetAllByVehicleDutyAsync(VehicleDutyCode id)
        {
            return await this._objs.Where(x => id.Equals(x.VehicleDutyCode)).ToListAsync();
        }

        public async Task AddRangeAsync(List<WorkBlock> wks)
        {
            await this._objs.AddRangeAsync(wks);
        }

        public async Task<List<WorkBlock>> GetAllWorkBlocksAsync()
        {
            //string query = $"SELECT * FROM dbo.WorkBlocks as a, dbo.TripWorkBlock as b, dbo.Trips as c WHERE a.[Code]=b.WorkBlocksId AND c.[Key]=b.TripsId";

            var list = await this._objs.Include(p => p.Trips).ToListAsync();
            //.ToListAsync()
            return list;
        }

        public async Task<List<WorkBlock>> GetListWorkBlocksByVehicleDutyAsync(string id)
        {
            var list = await this._objs.Where(l => l.VehicleDutyCode == new VehicleDutyCode(id) ).Include(p => p.Trips).ToListAsync();
            return list;
        }

        public async Task<List<WorkBlock>> GetListWorkBlocksByDriverDutyAsync(string id)
        {
            var list = await this._objs.Where(l => l.DriverDutyCode == new DriverDutyCode(id)).Include(p => p.Trips).ToListAsync();
            return list;
        }

        public WorkBlock UpdateWorkBlock(WorkBlock wb)
        {

            this._objs.Update(wb);

           

            return wb;
        }
    }
}
