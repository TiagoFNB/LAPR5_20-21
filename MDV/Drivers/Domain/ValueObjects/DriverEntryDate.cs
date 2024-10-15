using System;
using System.Collections.Generic;
using DDDNetCore.Domain.Shared;

namespace DDDNetCore.Drivers.Domain.ValueObjects
{
    public class DriverEntryDate : ValueObject
    {
        public string EntryDate{ get; private set; }


        private DriverEntryDate() { }

        public DriverEntryDate(string date)
        {
            Validation(date);

            EntryDate = date;
        }

        private void Validation(string date)
        {

            if (string.IsNullOrEmpty(date))
            {
                throw new Exception("EntryDate must be defined");
            }


            var today = DateTime.Today;
            var parsedDate = Convert.ToDateTime(date); ;


            int result = DateTime.Compare(parsedDate, today);
            if (result > 0)
            {
                throw new Exception("Invalid Date");
            }





        }


        protected override IEnumerable<object> GetEqualityComponents()
        {
            // Using a yield return statement to return each element one at a time
            yield return EntryDate;


        }
        
    }
}
