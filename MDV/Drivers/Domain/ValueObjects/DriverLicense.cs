using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DDDNetCore.Domain.Shared;

namespace DDDNetCore.Drivers.Domain.ValueObjects
{
    public class DriverLicense : ValueObject
    {
        public string License { get; private set; }


        public DriverLicense(string license)
        {
            Validate(license);
            License = license;
        }
        private DriverLicense() { }


        private void Validate(string license)
        {

            if (string.IsNullOrEmpty(license))
            {
                throw new Exception("DriverLicense must be defined");
            }
            
        }

        protected override IEnumerable<object> GetEqualityComponents()
        {
            yield return License;
        }
    }
}
