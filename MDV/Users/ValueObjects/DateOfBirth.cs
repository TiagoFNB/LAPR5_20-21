using DDDNetCore.Domain.Shared;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DDDSample1.Domain.Users  // DDDNetCore.Domain.Users.ValueObjects
{
    public class DateOfBirth : ValueObject
    {
        public string dateOfBirth { get; private set; }


        private DateOfBirth() { }

        public DateOfBirth(DateTime d)
        {
            Validation(d);
           
            dateOfBirth = d.ToShortDateString(); // theres no Date  type in c# so i parse the Date from DateTime and store it as  string
        }

        private void Validation(DateTime birthdate)
        {
            
            var today = DateTime.Today;

           
            var age = today.Year - birthdate.Year;

            
            if(age<16){
               throw new Exception("You must be 16 years old or older");
            }
         
        }


        protected override IEnumerable<object> GetEqualityComponents()
        {
            // Using a yield return statement to return each element one at a time
            yield return dateOfBirth;
            

        }
        public override string ToString()
        {
            return $"{dateOfBirth}";
        }
    }
}