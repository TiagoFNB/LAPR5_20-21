//using DDDSample1.Domain.Shared;
//using System;
//using System.Collections.Generic;
//using System.Linq;
//using System.Threading.Tasks;
//using Newtonsoft.Json;
//namespace DDDSample1.Domain.Users //DDDNetCore.Domain.Roles
//{
//    public class UserDataSchemaId : DataSchemaId
//    {

//        [JsonConstructor]
//        public UserDataSchemaId(Guid value) : base(value)
//        {
//        }

//        public UserDataSchemaId(String value) : base(value)
//        {
//        }
        
       

//        override
//        protected Object createFromString(String text)
//        {
//            return new Guid(text);
//        }

//        override
//        public String AsString()
//        {
//            Guid obj = (Guid)base.ObjValue;
//            return obj.ToString();
//        }


//        public Guid AsGuid()
//        {
//            return (Guid)base.ObjValue;
//        }
//    }



//}
