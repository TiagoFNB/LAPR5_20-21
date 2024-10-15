using DDDNetCore.Lines.Dto;
using System.Net.Http;
using System.Threading.Tasks;

namespace DDDNetCore.Lines.Mappers
{
    public interface ILineMapper
    {
        public Task<LineDto> MapFromMdrToDtoAsync(HttpContent line);
    }
}
