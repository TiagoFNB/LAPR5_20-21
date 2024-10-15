using System;
using System.Linq;
using DDDSample1.Domain.Shared;

namespace DDDNetCore.Drivers.Domain.ValueObjects
{
    public class DriverMechanographicNumber : EntityId
    {
       

        public DriverMechanographicNumber(string number) : base(number)
        {
            Validate(number);
        }

        override
            protected Object createFromString(string number)
        {
            return number;
        }
        override
            public string AsString()
        {
            return (string)base.Value;
        }

       

        private void Validate(string number)
        {
           
            if (string.IsNullOrEmpty(number))
            {
                throw new Exception("DriverMechanographicNumber must be defined");
            }

            if (!number.All(char.IsLetterOrDigit))
            {
                throw new Exception("DriverMechanographicNumber must be alphanumeric");
            }

            if (number.Length != 9)
            {
                throw new Exception("DriverMechanographicNumber must be 9 characters long");
            }

        }

        internal bool Containsx(DriverMechanographicNumber i)
        {
            if (this.Value.Contains(i.Value))
            {
                return true;
            }
            return false;
        }
    }
}
