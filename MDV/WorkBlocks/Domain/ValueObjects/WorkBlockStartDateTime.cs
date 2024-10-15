using DDDNetCore.Domain.Shared;
using System;
using System.Collections.Generic;

namespace DDDNetCore.WorkBlocks.Domain.ValueObjects
{
    public class WorkBlockStartDateTime : ValueObject
    {
        public DateTime DateTime { get; private set; }

        private WorkBlockStartDateTime() { }

        public WorkBlockStartDateTime(DateTime dateTime)
        {
            this.DateTime = dateTime;
        }

        protected override IEnumerable<object> GetEqualityComponents()
        {
            yield return DateTime;
        }

        public override string ToString()
        {
            return DateTime.ToString();
        }
    }
}
