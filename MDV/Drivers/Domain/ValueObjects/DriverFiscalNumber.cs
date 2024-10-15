using System;
using System.Collections.Generic;
using DDDNetCore.Domain.Shared;

namespace DDDNetCore.Drivers.Domain.ValueObjects
{
    public class DriverFiscalNumber : ValueObject
    {
        public string Nif { get; private set; }


        public DriverFiscalNumber(string nif)
        {
            Validate(nif);
            Nif = nif;
        }
        private DriverFiscalNumber() { }


        private void Validate(string nif)
        {

            if (string.IsNullOrEmpty(nif))
            {
                throw new Exception("FiscalNumber must be defined");
            }
            if (nif.Length != 9)
            {
                throw new Exception("FiscalNumber must be 9 characters long");
            }
        }




        protected override IEnumerable<object> GetEqualityComponents()
        {
            yield return Nif;
        }
    }
}
