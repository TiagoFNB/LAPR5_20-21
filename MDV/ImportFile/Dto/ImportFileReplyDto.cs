using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace DDDNetCore.ImportFile.Dto
{
    public class ImportFileReplyDto
    {

        public  string message { get; set; }
        public int numberOfErros { get; set; }

        public int NumbersOfLinesPresentInFile { get; set; }

        public int NumbersOfObjectsImported { get; set; }
        public List<string> errorList { get; set; }


        public ImportFileReplyDto()
        {
            errorList = new List<string>();
        }
        public ImportFileReplyDto(List<string> errorList,int numberOfLinesInFile, int numberOfObjectsImported) {
            // going to get and parse to int the first element of the list ( number of lines present in the file)
           
         
            this.NumbersOfLinesPresentInFile = numberOfLinesInFile;
            this.NumbersOfObjectsImported = numberOfObjectsImported;
            this.numberOfErros = errorList.Count;
            this.errorList = errorList;

            if (NumbersOfObjectsImported > 0)
            {
                this.message = "File was uploaded";
                
            }
            else
            {
                this.message = "Error: File was read but nothing was imported, either the file has invalid informations or all Trips, Vehicle Duties, Driver Duties and WorkBlocks already exists";
              
            }
           
        }

     


        public Boolean checkIfThereSomethingWasImported()
        {
            if (this.errorList == null)
            {
                return false; // if list is not instanciated when this method is called it is because there was a severe error ( see above)
            }

            if(NumbersOfObjectsImported==0) 
            {
                return false; 
            }
            return true;

        }
    }
}
