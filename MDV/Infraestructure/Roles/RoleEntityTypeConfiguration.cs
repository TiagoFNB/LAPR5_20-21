using DDDSample1.Domain.Roles;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;

namespace DDDSample1.Infrastructure.Categories
{
    internal class RoleEntityTypeConfiguration : IEntityTypeConfiguration<Role>
    {
        public void Configure(EntityTypeBuilder<Role> builder)
        {

            builder.HasKey(r => r.Id);
            builder.Property(b => b.Id).HasColumnName("Name");
           
         


            //IF NAME WAS NOT ENTITY THIS IS THE WAY TO MAKE IT UNIQUE

            //builder.OwnsOne(r => r.Name, n =>
            //{
            //    n.HasIndex(c => c.Name).IsUnique();
            //});

           

        }
    }
}