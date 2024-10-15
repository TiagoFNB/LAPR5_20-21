using System;
using System.Collections.Generic;
using DDDNetCore.Domain.Shared;

namespace DDDNetCore.Vehicles.ValueObjects
{
    public class VehicleType : ValueObject
    {
        public string Type { get; private set; }


        public VehicleType(string type)
        {
            Validate(type);
            Type = type;
        }
        private VehicleType() { }


        private void Validate(string name)
        {

            if (string.IsNullOrEmpty(name))
            {
                throw new Exception("VehicleType must be defined");
            }
           
        }




        protected override IEnumerable<object> GetEqualityComponents()
        {
            yield return Type;
        }
    }
}
