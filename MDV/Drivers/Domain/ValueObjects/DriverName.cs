using System;
using System.Collections.Generic;
using DDDNetCore.Domain.Shared;

namespace DDDNetCore.Drivers.Domain.ValueObjects
{
    public class DriverName : ValueObject
    {
        public string Name { get; private set; }


        public DriverName(string name)
        {
            Validate(name);
            Name = name;
        }
        private DriverName() { }


        private void Validate(string name)
        {

            if (string.IsNullOrEmpty(name))
            {
                throw new Exception("Driver Name must be defined");
            }
           
        }




        protected override IEnumerable<object> GetEqualityComponents()
        {
            yield return Name;
        }
    }
}
