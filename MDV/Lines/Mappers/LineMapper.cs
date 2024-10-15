using DDDNetCore.Lines.Dto;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;
using System.Linq;
namespace DDDNetCore.Lines.Mappers
{
    public class LineMapper : ILineMapper
    {

        public LineMapper() { }

        public async Task<LineDto> MapFromMdrToDtoAsync(HttpContent line)
        {
            string data = await line.ReadAsStringAsync();
            data = data.Substring(1,data.Length-2);

            try {
                LineDto result = JsonSerializer.Deserialize<LineDto>(data);
                return result;
            }
            catch (Exception e)
            {
                throw new Exception("Could not deserealize Line Json");
            }
        }
    }
}
