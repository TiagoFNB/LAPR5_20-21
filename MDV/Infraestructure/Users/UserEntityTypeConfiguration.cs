using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using DDDNetCore.Domain;
using DDDSample1.Domain.Users;

namespace DDDSample1.Infrastructure.Categories
{
    internal class UserEntityTypeConfiguration : IEntityTypeConfiguration<User>
    {
        public void Configure(EntityTypeBuilder<User> builder)
        {
           //Defining Primary Key, must be String or an object EntityId

            builder.HasKey(u => u.Id);
            builder.Property(u => u.Id).HasColumnName("Id");

            // Comented for future reference if i want to make a value Object unique
            builder.OwnsOne(u => u.Email, e =>
            {
                e.Property(e => e.Email).HasColumnName("Email");
                e.HasIndex(e => e.Email).IsUnique();
            });

            builder.OwnsOne(u => u.Name, n=>
            {
                n.Property(e => e.Name).HasColumnName("Name");
            });

            
            builder.OwnsOne(u => u.Address);

            builder.OwnsOne(e => e.Address, ad => {
                ad.Property(e => e.City).HasColumnName("City");
                ad.Property(e => e.Street).HasColumnName("Street");
                ad.Property(e => e.Country).HasColumnName("Country");
            } );

            //Property becouse RoleNome even if it can be considered a value object dont have anything inside,  its value is inside EntityId
            builder.Property(u => u.RoleName).HasColumnName("Role");


            builder.OwnsOne(u => u.UserDataOfBirth, date => {
                date.Property(e => e.dateOfBirth).HasColumnName("DateOfBirth");
              
            });

            builder.Property(u => u.HashedPassword).HasColumnName("Password");
            
        }
    }
}