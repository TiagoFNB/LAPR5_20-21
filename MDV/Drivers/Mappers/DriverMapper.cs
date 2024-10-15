using DDDNetCore.Drivers.Domain;
using DDDNetCore.Drivers.Dto;

namespace DDDNetCore.Drivers.Mappers
{
    public class DriverMapper : IDriverMapper
    {


        public DriverMapper()
        {

        }

        public Driver MapFromDriverDtoToDomain(DriverDto driverDto)
        {
            return new Driver(driverDto.MechanographicNumber,driverDto.Name, driverDto.BirthDate, driverDto.CitizenCardNumber, driverDto.EntryDate, driverDto.DepartureDate, driverDto.FiscalNumber, driverDto.Type,driverDto.License,driverDto.LicenseDate);

        }

        public DriverDto MapFromDomain2Dto(Driver d)
        {
            if (d.DepartureDate != null)
            {
                return new DriverDto(d.Id.Value, d.Name.Name, d.BirthDate.BirthDate, d.CitizenCardNumber.CitizenCardNumber, d.EntryDate.EntryDate, d.DepartureDate.DepartureDate, d.FiscalNumber.Nif, d.Type.Type,d.License.License,d.LicenseDate.LicenseDate);
            }
            return new DriverDto(d.Id.Value, d.Name.Name, d.BirthDate.BirthDate, d.CitizenCardNumber.CitizenCardNumber, d.EntryDate.EntryDate, null, d.FiscalNumber.Nif, d.Type.Type,d.License.License,d.LicenseDate.LicenseDate);

        }
    }
}
