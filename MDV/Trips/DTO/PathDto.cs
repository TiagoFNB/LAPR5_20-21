using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace DDDNetCore.Trips.DTO
{
    public class PathDto
    {

        public string key { get; set; }

        public string line { get; set; }
        
        public string type { get; set; }
        public PathSegmentDto[] pathSegments { get; set; }

        //public PathDto(string key, string line, string[] pathSegments) { 
        //    this.Path = key;
        //    this.Line = line;
        //    this.CountNodes = pathSegments.Length +1;
        //}
    }

    public class PathSegmentDto
    {

        public string node1 { get; set; }

        public string node2 { get; set; }

        public int duration { get; set; }

        public int distance { get; set; }
    }
}
