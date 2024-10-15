using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace DDDNetCore.Lines.Dto
{
    public class LineDto
    {

        public string key { get; set; }

        public string name { get; set; }

        public string terminalNode1 { get; set; }

        public string terminalNode2 { get; set; }

        public List<string> AllowedVehicles { get; set; }

        public List<string> AllowedDrivers { get; set; }

        //public Dictionary<string, RGB> RGB { get; set; }

    }

    public class RGB
    {
        public int red { get; set; }
        public int green { get; set; }
        public int blue { get; set; }
    }
}
