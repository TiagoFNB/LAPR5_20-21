using System;

namespace DDDSample1.Domain.Shared
{
    /// <summary>
    /// Base class for entities.
    /// </summary>
    public abstract class DataSchemaId
    {
        protected Object ObjValue { get; }

        public String Value
        {
            get
            {
                if (this.ObjValue.GetType() == typeof(String))
                    return (String)this.ObjValue;
                return AsString();
            }
        }

        protected DataSchemaId(Object value)
        {
            if (value.GetType() == typeof(String))
                this.ObjValue = createFromString((String)value);
            else
                this.ObjValue = value;
        }


        protected abstract Object createFromString(String text);

        public abstract String AsString();




        public override int GetHashCode()
        {
            return Value.GetHashCode();
        }

    }
   
}