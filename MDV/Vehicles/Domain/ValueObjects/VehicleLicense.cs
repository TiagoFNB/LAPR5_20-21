using System;
using System.Text.RegularExpressions;
using DDDSample1.Domain.Shared;

namespace DDDNetCore.Vehicles.ValueObjects
{
    public class VehicleLicense : EntityId
    {

        public VehicleLicense(string licensePlate) : base(licensePlate)
            {
                Validate(licensePlate);
            }

            override
                protected Object createFromString(string licensePlate)
            {
                return licensePlate;
            }
            override
                public string AsString()
            {
                return (string)base.Value;
            }
            private void Validate(string licensePlate)
            {
                var regex =
                    @"^([0-9]{2}-[0-9]{2}-[A-Z]{2})$|^([0-9]{2}-[A-Z]{2}-[0-9]{2})$|^([A-Z]{2}-[0-9]{2}-[0-9]{2})$|^([A-Z]{2}-[0-9]{2}-[A-Z]{2})$";

            var match = Regex.Match(licensePlate, regex);

            if (!match.Success)
            {
                throw new Exception("Vehicle License Plate is in invalid format");
            }

            if (string.IsNullOrEmpty(licensePlate))
            {
                throw new Exception("Vehicle License Plate must be defined");
            }

               

            }


    }
}

