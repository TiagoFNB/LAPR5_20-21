using System;
using System.Collections.Generic;
using DDDNetCore.Domain.Shared;

namespace DDDNetCore.Drivers.Domain.ValueObjects
{
    public class DriverType : ValueObject
    {
        public string Type { get; private set; }


        public DriverType(string type)
        {
            Validate(type);
            Type = type;
        }
        private DriverType() { }


        private void Validate(string name)
        {

            if (string.IsNullOrEmpty(name))
            {
                throw new Exception("DriverType must be defined");
            }

        }




        protected override IEnumerable<object> GetEqualityComponents()
        {
            yield return Type;
        }
    }
}
