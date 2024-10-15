using System;
using System.Collections.Generic;
using DDDNetCore.Domain.Shared;

namespace DDDNetCore.Vehicles.ValueObjects
{
    public class VehicleEntryDateOfService : ValueObject
    {
        public string EntryDateOfService { get; private set; }


        private VehicleEntryDateOfService() { }

        public VehicleEntryDateOfService(string date)
        {
            Validation(date);

            EntryDateOfService = date; 
        }

        private void Validation(string date)
        {

            if (string.IsNullOrEmpty(date))
            {
                throw new Exception("EntryDateOfService must be defined");
            }

            var today = DateTime.Today;
            var parsedDate = Convert.ToDateTime(date); ;


            var result = DateTime.Compare(parsedDate, today);
            if (result > 0)
            {
                throw new Exception("Invalid Date");
            }



           

        }


        protected override IEnumerable<object> GetEqualityComponents()
        {
            // Using a yield return statement to return each element one at a time
            yield return EntryDateOfService;


        }
        public override string ToString()
        {
            return $"{EntryDateOfService}";
        }
    }
}
