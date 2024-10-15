using DDDNetCore.DriverDuties.Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DDDNetCore.Infraestructure.DriverDuties
{
    public class DriverDutyEntityTypeConfiguration : IEntityTypeConfiguration<DriverDuty>
    {
        public void Configure(EntityTypeBuilder<DriverDuty> builder)
        {
            //Defining Primary Key, must be String or an object EntityId
            builder.HasKey(u => u.Id);
            builder.Property(u => u.Id).HasColumnName("Code");

            builder.Property(u => u.DriverMecNumber).HasColumnName("DriverMechanographicNumber");
            //builder.OwnsOne(u => u.DriverMecNumber, n =>
            //{
            //    n.Property(e => e.Value).HasColumnName("Driver Mechanographic Number");
            //});

        }
    }
}