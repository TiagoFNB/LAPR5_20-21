using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace DDDNetCore.Users.Dtos
{
    public class ForgetUserDto
    {


        public string Email { get; set; }
        public string Password { get; set; }
        public string Message { get; set; }


        [JsonConstructor]
        public ForgetUserDto(string email,string password)
        {
            this.Email = email;
            this.Password = password;

        }

        public void defineSuccessMessage()
        {
            Password = null;
            Message = Email + " was deleted";
        }
        public void defineUnauthorizeMessage()
        {
            Password = null;
            Message = Email + " is not your real email, please try to be more serious!";
        }

        public void defineInvalidMessage(string message)
        {
            Password = null;
            Message = Email + ": couldnt be deleted: "+ message;
        }
    }
}
