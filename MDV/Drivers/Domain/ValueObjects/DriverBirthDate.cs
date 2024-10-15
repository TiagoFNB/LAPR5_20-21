using System;
using System.Collections.Generic;
using DDDNetCore.Domain.Shared;

namespace DDDNetCore.Drivers.Domain.ValueObjects
{
    public class DriverBirthDate : ValueObject
    {
        public string BirthDate { get; private set; }


        private DriverBirthDate() { }

        public DriverBirthDate(string date)
        {
            Validation(date);

            BirthDate = date;
        }

        private void Validation(string date)
        {


            if (string.IsNullOrEmpty(date))
            {
                throw new Exception("BirthDate must be defined");
            }


            var today = DateTime.Today;
            var parsedDate = Convert.ToDateTime(date);
            ;

            int age = today.Year - parsedDate.Year;
            if (today.Month < parsedDate.Month || (today.Month == parsedDate.Month && today.Day < parsedDate.Day)){
                age--;
            }

            if (age < 18)
            {
                throw new Exception("Invalid BirthDate");
            }





        }


        protected override IEnumerable<object> GetEqualityComponents()
        {
            // Using a yield return statement to return each element one at a time
            yield return BirthDate;


        }

    }
}
