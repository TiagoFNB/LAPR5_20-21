using DDDNetCore.Domain.Shared;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.Users // DDDNetCore.Domain.Users.ValueObjects
{
    public class UserEmail : ValueObject
    {
        public string Email { get; private set; }


        public UserEmail(string email) 
        {
            Validate(email);
            this.Email = email;
           
        }

        private void Validate(string email)
        {
             Boolean validation = new EmailAddressAttribute().IsValid(email);

             if(validation==false){
                     throw new Exception("Email must be a valid one");
             }
        }

        protected override IEnumerable<object> GetEqualityComponents()
        {
            yield return Email;
        }

        //protected override IEnumerable<object> GetEqualityComponents()
        //{

        //    // Using a yield return statement to return each element one at a time
        //    yield return Email;


        //}


    }
}
