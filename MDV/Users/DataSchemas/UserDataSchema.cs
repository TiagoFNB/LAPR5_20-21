//using DDDSample1.Domain.Roles;
//using DDDSample1.Domain.Shared;
//using System;
//using System.Collections.Generic;
//using System.ComponentModel.DataAnnotations;
//using System.Linq;
//using System.Threading.Tasks;

//namespace DDDSample1.Domain.Users
//{
//    public class UserDataSchema : DataSchema<UserDataSchemaId>
//    {

//        //public string Id;
//        [Required]
//        [StringLength(40)]
//        public string Name { get;  private set; }
//        [Required]
       
//        public string Email { get; private set; }

//        [Required]
//        [StringLength(30)]
//        public string Street { get; private set; }

//        [Required]
//        [StringLength(30)]
//        public string City { get; private set; }

//        [Required]
//        [StringLength(10)]
//        public string Country { get; private set; }

//        [Required]
        
//        public string HashedPassword { get; private set; }

//        [Required]
        
//        public RoleDataSchema Role { get; private set; }


//        private UserDataSchema() { }


//        public UserDataSchema(string id,string name, string email, string street, string city, string country, string hashedpassword, RoleDataSchema role)
//        {
//            this.Id = new UserDataSchemaId(id);
//            Name = name;
//            Email = email;
//            Street = street;
//            City = city;
//            Country = country;
//            HashedPassword = hashedpassword;
//            Role = role;
//        }

        
//    }
//}
