using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DDDNetCore.VehicleDuties.Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DDDNetCore.Infraestructure.VehicleDuties
{
    public class VehicleDutyEntityTypeConfiguration : IEntityTypeConfiguration<VehicleDuty>
    {
        public void Configure(EntityTypeBuilder<VehicleDuty> builder)
        {
            //Defining Primary Key, must be String or an object EntityId
            builder.HasKey(u => u.Id);
            builder.Property(u => u.Id).HasColumnName("Code");

            builder.Property(u => u.VehicleLicense).HasColumnName("VehicleLicense");

        }
    }
}
