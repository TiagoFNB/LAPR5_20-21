using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DDDNetCore.Domain.Shared;

namespace DDDNetCore.Trips.Domain.ValueObjects
{
    public class PassingTime : ValueObject
    {
        public int Time { get; private set; }

        public PassingTime(int value)
        {
            validation(value);
            Time = value;
        }
        private PassingTime()
        { }

        private void validation(int value)
        {
            if (value == 0)
            {
                throw new InvalidOperationException("Passing time can't have a value with 0 duration.");
            }

        }
        protected override IEnumerable<object> GetEqualityComponents()
        {
            // Using a yield return statement to return each element one at a time
            yield return Time;
        }
        public override string ToString()
        {
            return $"{Time} ";
        }
    }
}
