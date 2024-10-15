using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DDDSample1.Domain.Users
{
    public class LoginResultDto
    {

        public string Email { get; set; }

       
        public string Role { get; set; }

        public string Token { get; set; }

        public string Name { get; set; }

        public LoginResultDto(string email, string role, string token, string name)
        {
            this.Email = email;
            this.Role = role;
            this.Token = token;
            this.Name = name;
        }
    }
}
