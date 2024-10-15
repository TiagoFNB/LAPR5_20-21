using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DDDSample1.Domain.Shared;

namespace DDDNetCore.VehicleDuties.Domain.ValueObjects
{
    public class VehicleDutyCode : EntityId
    {

        public VehicleDutyCode(string code) : base(code)
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
                throw new Exception("VehicleDutyCode must be defined");
            }

            if (!code.All(char.IsLetterOrDigit))
            {
                throw new Exception("VehicleDutyCode must be alphanumeric");
            }

            if (code.Length != 10)
            {
                throw new Exception("VehicleDutyCode must be 10 characters long");
            }

        }
    }
}
