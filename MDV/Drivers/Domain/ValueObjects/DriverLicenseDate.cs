using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DDDNetCore.Domain.Shared;

namespace DDDNetCore.Drivers.Domain.ValueObjects
{
    public class DriverLicenseDate : ValueObject
    {
        public string LicenseDate { get; private set; }


        public DriverLicenseDate(string licenseDate)
        {
            Validate(licenseDate);
            LicenseDate = licenseDate;
        }
        private DriverLicenseDate() { }


        private void Validate(string date)
        {

            if (string.IsNullOrEmpty(date))
            {
                throw new Exception("DriverLicenseDate must be defined");
            }

        }

        protected override IEnumerable<object> GetEqualityComponents()
        {
            yield return LicenseDate;
        }
    }
}
