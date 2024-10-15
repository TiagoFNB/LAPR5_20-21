using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace DDDSample1.Domain.Roles
{
    public class CreateRoleDto
    {
        [Required]
        public string Name { get; set; }
      

       
        public CreateRoleDto(string name)
        {
            Name = name;
           
        }
    }

}
