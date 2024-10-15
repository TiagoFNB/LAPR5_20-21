using DDDNetCore.Drivers.Domain.ValueObjects;
using DDDNetCore.DriverDuties.Domain.ValueObjects;
using DDDSample1.Domain.Shared;
using System;
using System.Linq;
using System.Text;

namespace DDDNetCore.DriverDuties.Domain
{
    public class DriverDuty : Entity<DriverDutyCode>, IAggregateRoot, IDriverDuty
    {

        public DriverMechanographicNumber DriverMecNumber { get; private set; }

        public DriverDuty(){}

        public DriverDuty(string Id, string DriverMecNumber)
        {
            this.Id = new DriverDutyCode(Id);
            if (DriverMecNumber != null)
            {
                this.DriverMecNumber = new DriverMechanographicNumber(DriverMecNumber);
            }

          
        }

        public DriverDuty(string DriverMecNumber)
        {
            const string src = "abcdefghijklmnopqrstuvwxyz0123456789";
            int length = 10;
            var code = new StringBuilder();
            Random RNG = new Random();
            for (var i = 0; i < length; i++)
            {
                var c = src[RNG.Next(0, src.Length)];
                code.Append(c);
            }

            this.Id = new DriverDutyCode(code.ToString());

            if (DriverMecNumber != null)
            {
                this.DriverMecNumber = new DriverMechanographicNumber(DriverMecNumber);
            }
           
            


        }
    }
}
