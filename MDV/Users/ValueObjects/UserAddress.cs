using DDDNetCore.Domain.Shared;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DDDSample1.Domain.Users  // DDDNetCore.Domain.Users.ValueObjects
{
    public class UserAddress : ValueObject
    {
        public string Street { get; private set; }
        public string City { get; private set; }
       
        public string Country { get; private set; }
       

        private UserAddress() { }

        public UserAddress(string street, string city, string country)
        {
            Validate(street,city,country);
            Street = street;
            City = city;
           
            Country = country;
            
        }

        private void Validate(string street, string city, string country){
       if(string.IsNullOrEmpty(street) ||string.IsNullOrEmpty(city) ||string.IsNullOrEmpty(country) ){
           throw new Exception(" Address must be defined");
       }
       if(street.Length<4 || city.Length<3 || country.Length<3){
           throw new Exception(" Address is not well defined");
       }
        }

        protected override IEnumerable<object> GetEqualityComponents()
        {
            // Using a yield return statement to return each element one at a time
            yield return Street;
            yield return City;
           
            yield return Country;
           
        }
        public override string ToString()
        {
            return $"{Street}, {City}, {Country} ";
        }
    }
}
