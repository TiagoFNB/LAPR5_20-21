using DDDSample1.Domain.Shared;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DDDNetCore.DriverDuties.Domain.ValueObjects
{
    public class DriverDutyCode : EntityId
    {

        public DriverDutyCode(string code) : base(code)
        {
            Validate(code);
        }

        public override string AsString()
        {
            return (string)base.Value;
        }

        protected override object createFromString(string id)
        {
            return id;
        }

        private void Validate(string code)
        {
           

            if (string.IsNullOrEmpty(code))
            {
                throw new Exception("DriverDutyCode must be defined");
            }

            if (!code.All(char.IsLetterOrDigit))
            {
                throw new Exception("DriverDutyCode must be alphanumeric");
            }

            if (code.Length != 10)
            {
                throw new Exception("DriverDutyCode must be 10 characters long");
            }

        }
    }
}
