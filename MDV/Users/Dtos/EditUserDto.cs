using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace DDDSample1.Domain.Users
{
    public class EditUserDto
    {
        [Required]
        public string Email { get; set; }
        [Required]
        public string Role { get; set; }


        public EditUserDto(string email, string role)
        {
            Email = email;
            Role = role;
        }
    }
}
