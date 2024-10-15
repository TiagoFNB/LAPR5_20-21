
using DDDSample1.Domain.Shared;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DDDSample1.Domain.Roles // DDDNetCore.Domain.Roles.ValueObjects
{
    public class RoleName : EntityId // ValueObject
    {
       // public string Name {  get; private set; }

        public RoleName(string name) : base(name)
        {
            validation(name);
          //  Name = name;
        }

      private RoleName(): base(null)
        {

        }

        private void validation(string name)
        {
            if (name == null)
            {
                throw new InvalidOperationException("The role name must be defined");
            }
            if (name.Length > 19 || name.Length < 3)
            {
                throw new InvalidOperationException("The role name must be between 3 and 16 chars");
            }
        }
       
        //protected override IEnumerable<object> GetEqualityComponents()
        //{
        //    yield return Name;
        //}

        protected override object createFromString(string text)
        {
            return text;
        }

        public override string AsString()
        {
            return (string)base.Value;
        }
    }
}
