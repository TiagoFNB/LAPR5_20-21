using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DDDNetCore.WorkBlocks.Dto
{
    public class WorkBlockDto { 


        public string Code;
  
        public string DriverDutyCode;

        public string VehicleDutyCode;

        public string StartDate;

        public string StartTime;

        public string EndDate;

        public string EndTime;

        public string[] trips;

        public WorkBlockDto(string id, string driverDutyCode, string vehicleDutyCode, string startDate, string startTime, string endDate, string endTime, string[] trips)
        {
            this.Code = id;
            this.DriverDutyCode = driverDutyCode;
            this.VehicleDutyCode = vehicleDutyCode;
            this.StartDate = startDate;
            this.StartTime = startTime;
            this.EndDate = endDate;
            this.EndTime = endTime;
            this.trips = trips;
        }

    }
}
