using DDDNetCore.WorkBlocks.Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;


namespace DDDNetCore.Infraestructure.WorkBlocks
{
    internal class WorkBlockEntityTypeConfiguration : IEntityTypeConfiguration<WorkBlock>
    {
        public void Configure(EntityTypeBuilder<WorkBlock> builder)
        {
            //Defining Primary Key,
            builder.HasKey(u => u.Id);
            builder.Property(u => u.Id).HasColumnName("Code");

            //Start Date Time
            builder.OwnsOne(u => u.StartDateTime, n =>
            {
                n.Property(e => e.DateTime).HasColumnName("StartDateTime");
            });

            //End Date Time
            builder.OwnsOne(u => u.EndDateTime, n =>
            {
                n.Property(e => e.DateTime).HasColumnName("EndDateTime");
            });

            //Driver Duty Reference
            builder.Property(u => u.DriverDutyCode).HasColumnName("DriverDutyCode");

            //Vehicle Duty Reference
            builder.Property(u => u.VehicleDutyCode).HasColumnName("VehicleDutyCode");

        }
    }
}
