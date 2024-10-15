using DDDNetCore.DriverDuties.Domain.ValueObjects;
using DDDNetCore.Trips.Domain;
using DDDNetCore.VehicleDuties.Domain.ValueObjects;
using DDDNetCore.WorkBlocks.Domain.ValueObjects;
using DDDSample1.Domain.Shared;
using System;
using System.Collections.Generic;

namespace DDDNetCore.WorkBlocks.Domain
{
    public class WorkBlock : Entity<WorkBlockCode>, IAggregateRoot, IWorkBlock
    {
        /**
         *  Work Block Start Instant
         */
        public WorkBlockStartDateTime StartDateTime;

        /**
         * Work Block End Instant
         */
        public WorkBlockEndDateTime EndDateTime;

        /**
         * Driver Duty this workblock belongs to
         */
        public DriverDutyCode DriverDutyCode;

        /**
         * Driver Duty this workblock belongs to
         */
        public VehicleDutyCode VehicleDutyCode;

        /**
         * Trips this workblock covers (either fully or partially)
         */
        public List<Trip> Trips { get; private set; }

        public WorkBlock() { }

        public WorkBlock(DateTime startDateTime, DateTime endDateTime, string driverDutyCode, string vehicleDutyCode, List<Trip> trips)
        {
            Validate(startDateTime,endDateTime);

            //Value object creations
            this.Id = new WorkBlockCode(Guid.NewGuid());
            this.StartDateTime = new WorkBlockStartDateTime(startDateTime);
            this.EndDateTime = new WorkBlockEndDateTime(endDateTime);
            this.VehicleDutyCode = new VehicleDutyCode(vehicleDutyCode);

            if (driverDutyCode == null)
            {
                this.DriverDutyCode = null;
            }
            else
            {
                this.DriverDutyCode = new DriverDutyCode(driverDutyCode);
            }
            
            //Maps every trip string to it's corresponding value object and adds it to the Trips list
            this.Trips = trips;
        }

        /**
         * Validates the local values
         */
        private void Validate(DateTime startDateTime, DateTime endDateTime)
        {

            if (startDateTime.CompareTo(endDateTime)>0)
            {
                throw new Exception("WorkBlock end time has to be earlier than the start time.");
            }

            double wbDuration = endDateTime.TimeOfDay.TotalSeconds - startDateTime.TimeOfDay.TotalSeconds;

            //TODO change the static value to be obtained by the file
            if(wbDuration > 14400)
            {
                throw new Exception("WorkBlocks cannot possibly last longer than the drivers legal contiguous work time.");
            }

        }

        /**
         * Add a trip to the trips list
         * 
         * @parameter trip - new element to add
         */
        public void addTrip(Trip trip)
        {
            this.Trips.Add(trip);
        }

        public void DefineDriverDuty(string driverDutyCode)
        {
          
            this.DriverDutyCode = new DriverDutyCode(driverDutyCode); ;
        }
    }
}
