using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DDDNetCore.Vehicles.Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DDDNetCore.Infraestructure.Vehicles
{
    internal class VehicleEntityTypeConfiguration : IEntityTypeConfiguration<Vehicle>
    {
        public void Configure(EntityTypeBuilder<Vehicle> builder)
        {
            //Defining Primary Key, must be String or an object EntityId

            builder.HasKey(u => u.Id);
            builder.Property(u => u.Id).HasColumnName("License");


            builder.OwnsOne(u => u.Vin, n =>
            {
                n.Property(e => e.Vin).HasColumnName("VIN");
                n.HasIndex(e => e.Vin).IsUnique();
            });

            builder.OwnsOne(u => u.Type,
                n =>
                {
                    n.Property(e => e.Type).HasColumnName("Type");
                });

            builder.OwnsOne(u => u.Date, d => {
                d.Property(e => e.EntryDateOfService).HasColumnName("EntryDateOfService");
            });


        }
    }
}
