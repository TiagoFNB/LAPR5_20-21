    using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;

using System.Threading.Tasks;
using DDDNetCore.Trips.Domain.ValueObjects;

namespace DDDNetCore.Trips.DTO
{
    public class RegisterTripsDto
    {

        public string Key { get; set; }
        [Required]
        public string PathId { get; set; }
        [Required]
        public string LineId { get; set; }
        [Required]
        public int StartingTime { get; set; } //seconds 
        
        public int EndTime { get; set; } //seconds 
        
        public int Frequency { get; set; } //seconds 
        public List<int> PassingTimes { get; set; }

        [JsonConstructor]
        public RegisterTripsDto(string pathId, string lineId, int startingTime, int endTime, int frequency)
        {
            this.PathId = pathId;
            this.LineId = lineId;
            this.StartingTime = startingTime;
            if (endTime != 0 && frequency != 0)
            {
                this.EndTime = endTime;
                this.Frequency = frequency;
            }
            
        }


        public RegisterTripsDto(string key, string pathId, string lineId, int startingTime)
        {
            this.Key = key;
            this.PathId = pathId;
            this.LineId = lineId;
            this.StartingTime = startingTime;
            

        }


        public RegisterTripsDto(string key, string path, string line, List<PassingTime> passingTimes)
        {
            this.Key = key;
            this.PathId = path;
            this.LineId = line;
            this.PassingTimes = new List<int> { };
            foreach (var value in passingTimes)
            {
                this.PassingTimes.Add(value.Time);
            }
        }
    }
}
