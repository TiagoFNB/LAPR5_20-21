using DDDNetCore.Domain.Shared;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DDDSample1.Domain.Users // DDDNetCore.Domain.Users.ValueObjects
{
    public class UserName : ValueObject
    {
        public string Name { get; private set; }

        public UserName(string name)
        {
            Validate(name);
            Name = name;
        }
        private UserName() { }


        private void Validate(string name)
        {

            if (string.IsNullOrEmpty(name))
            {
                throw new Exception("Name must be defined");
            }
            if (name.Length < 3|| name.Length > 50)
            {
                throw new Exception(" Name msut be between 3 and 50 characters long");
            }
        }
        protected override IEnumerable<object> GetEqualityComponents()
        {
            
                // Using a yield return statement to return each element one at a time
                yield return Name;
              
            
        }

        public override string ToString()
        {
            return $"{Name} ";
        }
    }
}
