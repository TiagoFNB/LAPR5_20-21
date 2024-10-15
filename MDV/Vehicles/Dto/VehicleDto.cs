using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace DDDNetCore.Vehicles.Dto
{
    public class VehicleDto
    {
        
        public string License { get; private set; }

       
        public string Vin { get; private set; }

        public string Type { get; private set; }

       
        public string Date { get; private set; }

        public VehicleDto(string license, string vin, string type, string date)
        {
            //  this.Id = new RoleId(Guid.NewGuid());
            // Name = new RoleName(name);

            this.License = license;
            this.Vin = vin;
            this.Type = type;
            this.Date = date;

        }
    }
}
