using System;
using System.Linq;
using System.Threading.Tasks;
using DDDSample1.Domain.Shared;
using FluentValidation;
using Newtonsoft.Json;

namespace DDDNetCore.Trips.Domain.ValueObjects
{
    public class TripKey : EntityId
    {
        [JsonConstructor]
        public TripKey(Guid value) : base(value)
        {
        }

        public TripKey(string value) : base(value)
        {
            this.validation(value);
        }

        private TripKey() : base(null)
        {
        }

        public override String AsString()
        {

            if(base.ObjValue.GetType() == typeof(String)){
                return (string) base.Value;
            } 

            Guid obj = (Guid) base.ObjValue;
            return obj.ToString();
          
        }


        public Guid AsGuid()
        {
            return (Guid)base.ObjValue;
        }

        protected override Object createFromString(String text)
        {
            return text;
        }

        private void validation(string name)
        {
            if (name == "")
            {
                throw new InvalidOperationException("Empty trip key identity.");
            }

        }
    }
}
