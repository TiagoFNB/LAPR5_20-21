using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DDDNetCore.Domain.Shared;

namespace DDDNetCore.Trips.Domain.ValueObjects
{
    public class LineId : ValueObject
    {
        public string Line { get; private set; }
        
        public LineId(string name)
        {
            validation(name);
            Line = name;
        }

        private LineId()
        {}

        private void validation(string name)
        {
            if (String.IsNullOrEmpty(name))
            {
                throw new InvalidOperationException("Undefined line identity.");
            }

        }

        protected override IEnumerable<object> GetEqualityComponents()
        {

            // Using a yield return statement to return each element one at a time
            yield return Line;


        }

        public override string ToString()
        {
            return $"{Line} ";
        }
    }
}
