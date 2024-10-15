using System;
using System.Collections.Generic;
using DDDNetCore.Domain.Shared;

namespace DDDNetCore.Vehicles.ValueObjects
{
    public class VehicleVin : ValueObject
    {
        public string Vin { get; private set; }


        public VehicleVin(string vin)
        {
            Validate(vin);
            Vin = vin;
        }
        private VehicleVin() { }


        private void Validate(string name)
        {

            if (string.IsNullOrEmpty(name))
            {
                throw new Exception("VIN must be defined");
            }
            if (name.Length != 17 )
            {
                throw new Exception("VIN must be 17 characters long");
            }
        }




        protected override IEnumerable<object> GetEqualityComponents()
        {
            yield return Vin;
        }
    }
}