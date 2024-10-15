using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DDDNetCore.Vehicles.ValueObjects;
using DDDSample1.Domain.Shared;

namespace DDDNetCore.Vehicles.Domain
{
    public class Vehicle : Entity<VehicleLicense>, IAggregateRoot
    {
        public VehicleVin Vin { get; private set; }
        public VehicleType Type { get; private set; }

        public VehicleEntryDateOfService Date { get; private set; }

        private Vehicle(){
        }

        public Vehicle(string license,string vin,string type,string date)
        {

            this.Id = new VehicleLicense(license);
            this.Vin = new VehicleVin(vin);
            this.Type = new VehicleType(type);
            this.Date = new VehicleEntryDateOfService(date);

        }


    }
}
