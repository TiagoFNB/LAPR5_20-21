using System;
using System.Collections.Generic;
using DDDNetCore.Domain.Shared;

namespace DDDNetCore.Drivers.Domain.ValueObjects
{
    public class DriverDepartureDate
        : ValueObject
    {
        public string DepartureDate { get; private set; }


        private DriverDepartureDate() { }

        public DriverDepartureDate(string date)
        {
           

            DepartureDate = date;
        }

        


        protected override IEnumerable<object> GetEqualityComponents()
        {
            // Using a yield return statement to return each element one at a time
            yield return DepartureDate;


        }

    }
}
