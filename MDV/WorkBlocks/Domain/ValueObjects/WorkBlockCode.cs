using DDDSample1.Domain.Shared;
using Newtonsoft.Json;
using System;

namespace DDDNetCore.WorkBlocks.Domain.ValueObjects
{
    public class WorkBlockCode : EntityId
    {
        [JsonConstructor]
        public WorkBlockCode(Guid value) : base(value)
        {
        }

        public WorkBlockCode(string value) : base(value)
        {
        }

        private WorkBlockCode() : base(null)
        {
        }

        public override String AsString()
        {
            if (base.GetType() == typeof(String))
            {
                return (string)base.Value;
            }

            Guid obj = (Guid)base.ObjValue;
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
    }
}
