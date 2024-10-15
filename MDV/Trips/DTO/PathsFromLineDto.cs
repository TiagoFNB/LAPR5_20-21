using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DDDNetCore.Trips.DTO
{
    public class PathsFromLineDto
    {
        public string key { get; set; }

        public PathDto[] paths { get; set; }
    }
}
