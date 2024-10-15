using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace DDDSample1.Domain.Users
{
    public class RegisterUserDto
    {
       
        public string Name { get; set; }
       
        public string Email { get; set; }
     
        public string Street { get; set; }
      
        public string City { get; set; }
       
        public string Country { get; set; }
        
        public string RoleName { get; set; }

        [StringLength(14, MinimumLength = 6)]
        public string Password { get; set; }

          public DateTime DateOfBirth { get; set; }

        [JsonConstructor]
        public RegisterUserDto(string name, string email, string street, string city, string country, string roleName, string password,DateTime dateOfBirth ) // used for input from outside
        {
            Name = name;
            Email = email;
            Street = street;
            City = city;
            Country = country;
          Password = password;      
            DateOfBirth =dateOfBirth;

        }

        public RegisterUserDto(string name, string email, string street, string city, string country, string roleName, string dateOfBirth) // no password, used for output to outside
        {
            Name = name;
            Email = email;
            Street = street;
            City = city;
            Country = country;
                RoleName = roleName;
            DateOfBirth = DateTime.Parse(dateOfBirth);

        }

    }
}
