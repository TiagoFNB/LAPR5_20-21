using DDDNetCore.Trips.Domain.ValueObjects;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DDDNetCore.Trips.DTO
{
    public class ResponseTripDto
    {
        
        public string Key { get; set; }
        
        public string PathId { get; set; }
        
        public string LineId { get; set; }

        public List<int> PassingTimes { get; set; }


        public ResponseTripDto(string key, string path, string line, List<PassingTime> passingTimes)
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

