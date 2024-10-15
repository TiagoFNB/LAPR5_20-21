using DDDNetCore.Trips.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace DDDNetCore.ImportFile.Model
{
    public class TripsModel
    {

       public List<RegisterTripsDto> TripsDtoList { get; set; }
        public List<string> errors { get; set; }
        public int tripsInFile { get; set; }
        public int numberOfTripsImported { get; set; }

        public TripsModel()
        {
            TripsDtoList = new List<RegisterTripsDto>();
            errors = new  List<string>();
            tripsInFile = 0;
            numberOfTripsImported = 0;
        }

        
        public void addTrip(string key, string pathId, string lineId, string startingTime)
        {

            if (key == null)
            {

                errors.Add("Theres is a trip without a key");

            }

           else if (key.Length == 0)
            {
                    errors.Add("Theres is a trip with an empty key");
            }
               
           
            
            else
            {
                int StartTimeInt=0;

                try
                {
                    Boolean t = Int32.TryParse(startingTime, out StartTimeInt);
                    if (t)
                    {
                        string numberOfPathKey = Regex.Match(pathId, @"\d+").Value; // needed because in MDR we register each path from file only with the number inside the key
                        string numberOfLineKey = Regex.Match(lineId, @"\d+").Value; // needed because in MDR we register each line from file only with the number inside the key
                        RegisterTripsDto d = new RegisterTripsDto(key, numberOfPathKey, numberOfLineKey, StartTimeInt);
                        TripsDtoList.Add(d);

                    }
                    else
                    {
                        errors.Add("Trip with key: " + key + "  time of the first passing time is not a number: " + startingTime);
                    }
                 

                }
                catch (FormatException e)
                {
                    errors.Add("Trip with key: " + key + "  time of the first passing time is not a number: "+ startingTime);

                }
               

            }

        }
    }
}
