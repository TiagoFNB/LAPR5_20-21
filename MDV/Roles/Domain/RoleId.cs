﻿//using DDDSample1.Domain.Shared;
//using System;
//using System.Collections.Generic;
//using System.Linq;
//using System.Threading.Tasks;
//using Newtonsoft.Json;
//namespace DDDSample1.Domain.Roles //DDDNetCore.Domain.Roles
//{
//    public class RoleId : EntityId
//    {

//        [JsonConstructor]
//        public RoleId(Guid value) : base(value)
//        {
//        }

//        public RoleId(String value) : base(value)
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
