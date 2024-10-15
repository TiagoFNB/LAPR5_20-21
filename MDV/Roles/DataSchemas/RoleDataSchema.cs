//using DDDSample1.Domain.Shared;

//using Microsoft.EntityFrameworkCore;
//using System;
//using System.Collections.Generic;
//using System.ComponentModel.DataAnnotations;
//using System.Linq;
//using System.Threading.Tasks;

//namespace DDDSample1.Domain.Roles //DDDNetCore.Domain.Users.DataSchemas
//{
//    public class RoleDataSchema : DataSchema<RoleDataSchemaId>
//    {
//        [StringLength(19)]
        
        
//        public string Name { get; set; }




//        private RoleDataSchema() { }


//        public RoleDataSchema(string id, string Name)
//        {
//            this.Name = Name;
//            this.Id = new RoleDataSchemaId(id);
//        }

//        public RoleDataSchema(RoleId id, string Name)
//        {
//            this.Name = Name;
//            string x = id.AsString();
//            this.Id = new RoleDataSchemaId(x);
//        }
//    }
//}
