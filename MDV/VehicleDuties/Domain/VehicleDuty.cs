using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DDDNetCore.VehicleDuties.Domain.ValueObjects;
using DDDNetCore.Vehicles.ValueObjects;
using DDDSample1.Domain.Shared;

namespace DDDNetCore.VehicleDuties.Domain
{
    public class VehicleDuty : Entity<VehicleDutyCode>, IAggregateRoot, IVehicleDuty
    {

        public VehicleLicense VehicleLicense { get; private set; }

        public VehicleDuty()
        {
        }

        public VehicleDuty(string id, string vehicleLicense)
        {
            this.Id = new VehicleDutyCode(id);

            if (vehicleLicense != null)
            {
                this.VehicleLicense = new VehicleLicense(vehicleLicense);
            }
               
        }
    }
}