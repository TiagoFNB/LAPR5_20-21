using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;


namespace DDDNetCore.Drivers.Dto
{
    public class DriverDto
    {
        public string MechanographicNumber { get; private set; }
        public string Name { get; private set; }
        public string BirthDate { get; private set; }

        public string CitizenCardNumber { get; private set; }

        public string EntryDate { get; private set; }
        public string DepartureDate { get; private set; }
        public string FiscalNumber { get; private set; }
        public string License { get; private set; }
        public string LicenseDate { get; private set; }
        public string Type { get; private set; }

        
        public DriverDto(string mechanographicNumber, string name, string birthDate, string citizenCardNumber, string entryDate, string departureDate,
            string fiscalNumber, string type, string license, string licenseDate)
        {
            this.MechanographicNumber = mechanographicNumber;
            this.Name = name;
            this.BirthDate = birthDate;
            this.CitizenCardNumber = citizenCardNumber;
            this.EntryDate = entryDate;
            this.DepartureDate = departureDate;
            this.FiscalNumber = fiscalNumber;
            this.Type = type;
            this.License = license;
            this.LicenseDate = licenseDate;

        }
    }
}
