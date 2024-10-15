using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using DDDNetCore.Domain.Shared;

namespace DDDNetCore.Trips.Domain.ValueObjects
{
    public class PathId : ValueObject
    {

        public string Path { get; private set; }

        public PathId(string name)
        {
            validation(name);
            Path = name;
        }
        
        private PathId() { }

        private void validation(string name)
        {
            if (String.IsNullOrEmpty(name))
            {
                throw new InvalidOperationException("Undefined path identity.");
            }

        }

        protected override IEnumerable<object> GetEqualityComponents()
        {

            // Using a yield return statement to return each element one at a time
            yield return Path;


        }

        public override string ToString()
        {
            return $"{Path} ";
        }
    }
}
