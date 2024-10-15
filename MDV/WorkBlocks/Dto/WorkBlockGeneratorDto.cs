using System;
using System.Collections.Generic;
using System.Globalization;

namespace DDDNetCore.WorkBlocks.Dto
{
    public class WorkBlockGeneratorDto
    {
        /**
         *  Maximum number of blocks
         */
        public uint MaxBlocks;

        /**
         * Maximum duration of each block in seconds
         */
        public uint MaxDuration;

        /**
         * Date to create the work blocks in
         */
        public DateTime Date; 

        /**
         * Vehicle Duty for the work blocks to be assigned to
         */
        public string VehicleDuty;

        /**
         * List of Trips that the workblocks are assigned to
         */
        public List<string> Trips;

        public WorkBlockGeneratorDto(uint maxBlocks, uint maxDuration, string dateTime, string vehicleDuty, List<string> trips)
        {
            this.MaxBlocks = maxBlocks;
            this.MaxDuration = maxDuration;
            this.VehicleDuty = vehicleDuty;
            //if (trips != null)
            //{
            //    
            //}
            //else
            //{
            //    this.Trips = new List<string>();
            //}
            this.Trips = trips;
            this.Date = DateTime.Parse(dateTime, new CultureInfo("de-DE"), DateTimeStyles.NoCurrentDateDefault);
        }

    

        public void DefineVehicleDuty(string vehicleDuty)
        {
            this.VehicleDuty = vehicleDuty;
        }

        //public void DefineTrips(string trips)
        //{
        //    this.Trips.Add(trips);
        //}

    }
}
