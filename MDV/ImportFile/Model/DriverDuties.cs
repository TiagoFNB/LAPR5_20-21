using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using DDDNetCore.DriverDuties.Dto;
namespace DDDNetCore.ImportFile.Model
{


    public class DriverDutyModel
    {
        public DriverDutyPlannedDto driverDutyDto;
        public List<string> workBloks;

        public DriverDutyModel(string code, List<string> wbs)
        {
            this.workBloks = wbs;
            this.driverDutyDto = new DriverDutyPlannedDto(code,null, wbs);
           
        }

      
        

    }



    public class DriverDutiesModel
    {
        public List<string> errors;
        
        public List<DriverDutyModel> DriverDuties;
        public int numberOfDriverDutiesImported { get; set; }
        public int DriverDutiesInFile { get; set; }
        public DriverDutiesModel()
        {
            errors = new List<string>();
            DriverDuties = new List<DriverDutyModel>();
            numberOfDriverDutiesImported = 0;
            DriverDutiesInFile = 0;
        }

        public void addDriverDuty(string code, List<string> ddWbs)
        {
            Boolean validate = true;
            if (code == null)
            {
                validate = false;
                errors.Add("There is a driver duty without a code");
            }
            else 
            {
               if (code.Length == 0) { 
                    validate = false;
               errors.Add("There is a driver duty with an empty code");
                }
                else if (code.Length != 10)
                {
                    validate = false;
                    errors.Add("VehicleDuty with code: " + code + " must be 10 characters long");

                }

                 if (!code.All(char.IsLetterOrDigit))
                {
                    validate = false;
                    errors.Add("VehicleDuty with code: " + code + " must be alphanumeric");

                }

                



            }



            if (validate==true)
            {
                DriverDutyModel d = new DriverDutyModel(code, ddWbs);
                
                DriverDuties.Add(d);
            }
        }


    }
}
