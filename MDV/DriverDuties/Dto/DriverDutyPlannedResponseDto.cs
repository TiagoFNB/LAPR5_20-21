using DDDNetCore.WorkBlocks.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace DDDNetCore.DriverDuties.Dto
{

    

    public class DriverDutyPlannedResponseDto
    {


        /**
         * Corresponding driver mecanographic number
         */
        public string DriverDutyCode { get; set; }

        public string DriverMecNumber { get; set; }

        public string message { get; set; }

        public List<string> TriedToAffectedWorkBlockList { get; set; }

        public List<string> AffectedWorkBlockIList { get; set; }

        public List<ReplyWorkBlockDto> AffectedWorkBlockInfoList { get; set; }

        
        public DriverDutyPlannedResponseDto(string driverDutyCode, string driverMecNumber, List<string> workBlockList)
        {

            this.DriverDutyCode = driverDutyCode;
            this.DriverMecNumber = driverMecNumber;
            TriedToAffectedWorkBlockList = workBlockList;
            AffectedWorkBlockIList = new List<string>();

        }

        public void DefineAffectedWorkBlocks(List<ReplyWorkBlockDto> workBlockList)
        {
            this.AffectedWorkBlockInfoList = workBlockList;
            foreach(ReplyWorkBlockDto d in workBlockList)
            {
                AffectedWorkBlockIList.Add(d.Code);
            }

            if(AffectedWorkBlockIList.Count== TriedToAffectedWorkBlockList.Count)
            {
                this.message = "All work blocks were affect successfully";
            }
            else if (AffectedWorkBlockIList.Count > 0)
            {
                this.message = "Not all Work blocks were affect successfully";
            }
            else
            {
                this.message = "No Work blocks were affect successfully so the driver duty was not registered";
            }
        }



    }



}
