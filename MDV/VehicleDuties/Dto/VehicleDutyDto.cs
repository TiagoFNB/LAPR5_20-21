using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DDDNetCore.VehicleDuties.Dto
{
    public class VehicleDutyDto
    {
        public string VehicleLicense { get; private set; }
        public string VehicleDutyCode { get; private set; }

        [JsonConstructor]
        public VehicleDutyDto(string vehicleDutyCode, string vehicleLicense)
        {
            this.VehicleDutyCode = vehicleDutyCode;
            this.VehicleLicense =vehicleLicense;
        }


        public VehicleDutyDto(string vehicleDutyCode)
        {
            this.VehicleDutyCode = vehicleDutyCode;
          
        }
    }
}

