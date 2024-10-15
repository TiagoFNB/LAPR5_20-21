using DDDNetCore.Drivers.Domain.ValueObjects;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DDDNetCore.DriverDuties.Dto
{
    public class DriverDutyDto
    {
        /**
         * Driver Service alphanumeric code
         */
        public string DriverDutyCode { get;  set; }

        /**
         * Corresponding driver mecanographic number
         */
        public string DriverMecNumber { get;  set; }

        [JsonConstructor]
        public DriverDutyDto(string driverDutyCode, string driverMecNumber)
        {
            this.DriverDutyCode = driverDutyCode;
            this.DriverMecNumber = driverMecNumber;
        }


        public DriverDutyDto(string driverDutyCode)
        {
            this.DriverDutyCode = driverDutyCode;
            
        }
    }
}
