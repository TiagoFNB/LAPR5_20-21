using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DDDNetCore.WorkBlocks.Dto
{
    public class ReplyWorkBlockDto
    {
        public string Code;
        
        public string DriverDutyCode;

        public string VehicleDutyCode;

        public string Date;

        public int StartTime;

        public int EndTime;

        public string[] trips;

        public ReplyWorkBlockDto(string code, string driverDutyCode, string vehicleDutyCode, int startTime, int endTime, string[] trips, string date)
        {
            this.Code = code;
            this.DriverDutyCode = driverDutyCode;
            this.VehicleDutyCode = vehicleDutyCode;
            this.StartTime = startTime;
            this.EndTime = endTime;
            this.trips = trips;
            this.Date = date;
        }
        
    }
}
