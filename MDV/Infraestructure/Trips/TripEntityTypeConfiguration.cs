using DDDNetCore.Trips.Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DDDNetCore.Trips.Domain.ValueObjects;

namespace DDDNetCore.Infraestructure.Trips
{
    public class TripEntityTypeConfiguration : IEntityTypeConfiguration<Trip>
    {

        public void Configure(EntityTypeBuilder<Trip> builder)
        {
            //Defining Primary Key, must be String or an object EntityId

            builder.HasKey(u => u.Id);
            
            builder.Property(u => u.Id).HasColumnName("Key");

            builder.OwnsOne(u => u.Path, n =>
            {
                n.Property(e => e.Path).HasColumnName("Path");
            });

            builder.OwnsOne(u => u.Line, n =>
            {
                n.Property(e => e.Line).HasColumnName("Line");
            });


            builder.OwnsMany(e => e.PassingTimes, n =>
            {
                n.ToTable("PassingTimes");
                n.Property(e => e.Time).HasColumnName("Time");

            });
        }

    }
}
