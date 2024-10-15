using DDDNetCore.Trips.Domain.ValueObjects;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DDDNetCore.Trips.Domain;
using DDDNetCore.Trips.Repository;
using DDDSample1.Infrastructure.Shared;
using DDDSample1.Infrastructure;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;

namespace DDDNetCore.Infraestructure.Trips
{
    public class TripRepository : BaseRepository<Trip, TripKey>, ITripRepository
    {

        private readonly DbSet<Trip> _objs;
        public TripRepository(MDVDbContext context) : base(context.Trips)
        {
            this._objs = context.Trips;
        }

        public async Task<List<Trip>>  GetListTripsFromPathByTime(string pathId, string lineId, int time)
        {
            //podia ter posto $@  e nao so $
            //string query = $"SELECT * FROM dbo.Trips b, dbo.PassingTimes a  WHERE a.TripId = b.[Key] AND b.Path = '{path}' AND b.Line = '{line}' AND a.Time = {timeTemp}";
            string query = $"SELECT * FROM dbo.Trips as a, dbo.PassingTimes as b WHERE b.Time={time} AND a.Path='{pathId}' AND a.Line='{lineId}' AND a.[Key]=b.TripId";

            var list = await this._objs.FromSqlRaw(query).ToListAsync();
            //.ToListAsync()
            return list;
        }

        public async Task<List<Trip>> GetByLineAsync(LineId id)
        {
            string query = $"SELECT * FROM dbo.Trips as a WHERE a.Line='{id.Line}'";

            var list = await this._objs.FromSqlRaw(query).ToListAsync();

            return list;
        }
    }
}
