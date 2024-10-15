using System;
using System.Collections.Generic;
using DDDNetCore.Domain.Shared;

namespace DDDNetCore.Drivers.Domain.ValueObjects
{
    public class DriverCitizenCardNumber : ValueObject
    {
        public string CitizenCardNumber { get; private set; }


        public DriverCitizenCardNumber(string ccn)
        {
            Validate(ccn);
            CitizenCardNumber = ccn;
        }
        private DriverCitizenCardNumber() { }


        private void Validate(string ccn)
        {

            if (string.IsNullOrEmpty(ccn))
            {
                throw new Exception("CitizenCardNumber must be defined");
            }
            if (ccn.Length != 8)
            {
                throw new Exception("CitizenCardNumber must be 8 characters long");
            }
        }




        protected override IEnumerable<object> GetEqualityComponents()
        {
            yield return CitizenCardNumber;
        }
    }
}
