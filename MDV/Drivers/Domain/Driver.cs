using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DDDNetCore.Drivers.Domain.ValueObjects;
using DDDSample1.Domain.Shared;

namespace DDDNetCore.Drivers.Domain
{
    public class Driver : Entity<DriverMechanographicNumber>, IAggregateRoot
    {
        
        public DriverName Name { get; private set; }
        public DriverBirthDate BirthDate { get; private set; }

        public DriverCitizenCardNumber CitizenCardNumber { get; private set; }

        public DriverEntryDate EntryDate { get;private set; }
        public DriverDepartureDate DepartureDate { get; private set; }
        public DriverFiscalNumber FiscalNumber { get; private set; }

        public DriverType Type { get; private set; }
        public DriverLicense License { get; private set; }
        public DriverLicenseDate LicenseDate { get; private set; }



        private Driver() {}
        public Driver(string number,string name, string birthDate, string citizenCardNumber, string entryDate, string departureDate,
            string fiscalNumber, string type, string license, string licenseDate)
        {
            this.Id= new DriverMechanographicNumber(number);
            this.Name= new DriverName(name);
            this.BirthDate= new DriverBirthDate(birthDate);
            this.CitizenCardNumber= new DriverCitizenCardNumber(citizenCardNumber);
            this.EntryDate=new DriverEntryDate(entryDate);
            this.DepartureDate= new DriverDepartureDate(departureDate);
            this.FiscalNumber= new DriverFiscalNumber(fiscalNumber);
            this.Type= new DriverType(type);
            this.License=new DriverLicense(license);
            this.LicenseDate=new DriverLicenseDate(licenseDate);

        }
        





    }

    }

