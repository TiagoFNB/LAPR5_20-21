using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace DDDNetCore.DriverDuties.Dto
{

    public class DriverDutyPlannedDtoList
    {
        public List<DriverDutyPlannedDto> lista { get; set; }



    }


        public class DriverDutyPlannedDto
    {


        /**
         * Corresponding driver mecanographic number
         */
        public string DriverDutyCode { get; set; }

        public string DriverMecNumber { get;  set; }

        public List<string> WorkBlockList { get;  set; }

        [JsonConstructor]
        public DriverDutyPlannedDto(string driverDutyCode, string driverMecNumber, List<string> workBlocks)
        {
            this.DriverDutyCode = driverDutyCode;
            this.DriverMecNumber = driverMecNumber;
            this.WorkBlockList = workBlocks;
        }


        
    }



}
