using DDDNetCore.VehicleDuties.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace DDDNetCore.ImportFile.Model
{
    public class VehicleDutiesModel
    {

        public List<VehicleDutyDto> VehicleDutyDtoList;
        public List<string> errors;
        public int VehicleDutiesInFile { get; set; }

        public int numberOfVehicleDutiesImported { get; set; }
        
        public VehicleDutiesModel()
        {
            VehicleDutyDtoList = new List<VehicleDutyDto>();
            errors = new List<string>();
            VehicleDutiesInFile = 0;
            numberOfVehicleDutiesImported = 0;
        }

        public void addVehicleDuties(string code)
        {
            Boolean validate = true;
            if (string.IsNullOrEmpty(code))
            {
                validate = false;
                errors.Add("Theres a vehicle duty with an undefined code");
               
            }
          

             else if (!code.All(char.IsLetterOrDigit))
            {
                validate = false;
                errors.Add("VehicleDuty with code: "+code+ " must be alphanumeric");
                
            }

            else if (code.Length != 10)
            {
                validate = false;
                errors.Add("VehicleDuty with code: " + code + " must be 10 characters long");
              
            }
            if(validate ==true)
            {
                VehicleDutyDto d = new VehicleDutyDto(code);
                VehicleDutyDtoList.Add(d);
            }
            

        }

    }
}
