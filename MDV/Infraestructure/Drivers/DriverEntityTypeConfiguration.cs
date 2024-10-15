using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DDDNetCore.Drivers.Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DDDNetCore.Infraestructure.Drivers
{
    public class DriverEntityTypeConfiguration : IEntityTypeConfiguration<Driver>
    {
        public void Configure(EntityTypeBuilder<Driver> builder)
        {
            //Defining Primary Key, must be String or an object EntityId

            builder.HasKey(u => u.Id);
            builder.Property(u => u.Id).HasColumnName("MechanographicNumber");

            builder.OwnsOne(u => u.Name, n =>
            {
                n.Property(e => e.Name).HasColumnName("Name");
            });

            builder.OwnsOne(u => u.BirthDate, n =>
            {
                n.Property(e => e.BirthDate).HasColumnName("BirthDate");
            });

            builder.OwnsOne(u => u.CitizenCardNumber, n =>
            {
                n.Property(e => e.CitizenCardNumber).HasColumnName("CitizenCardNumber");
                n.HasIndex(e => e.CitizenCardNumber).IsUnique();
            });

            builder.OwnsOne(u => u.FiscalNumber, d => {
                d.Property(e => e.Nif).HasColumnName("FiscalNumber");
                d.HasIndex(e => e.Nif).IsUnique();
            });

            builder.OwnsOne(u => u.Type,
                n =>
                {
                    n.Property(e => e.Type).HasColumnName("Type");
                });

            builder.OwnsOne(u => u.License, d => {
                d.Property(e => e.License).HasColumnName("License");
            });

            builder.OwnsOne(u => u.LicenseDate, d => {
                d.Property(e => e.LicenseDate).HasColumnName("LicenseDate");
            });


            builder.OwnsOne(u => u.EntryDate, d => {
                d.Property(e => e.EntryDate).HasColumnName("EntryDate");
            });

            builder.OwnsOne(u => u.DepartureDate, d => {
                d.Property(e => e.DepartureDate).HasColumnName("DepartureDate");
            });


        }
    }
}