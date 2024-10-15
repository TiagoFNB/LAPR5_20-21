using DDDNetCore.Drivers.Domain;
using DDDNetCore.Infraestructure.Drivers;
using DDDNetCore.Infraestructure.Vehicles;
using DDDNetCore.Vehicles.Domain;
using Microsoft.EntityFrameworkCore;
using DDDSample1.Domain.Roles;
using DDDSample1.Domain.Users;
using DDDSample1.Infrastructure.Categories;
using DDDNetCore.Trips.Domain;
using DDDNetCore.Infraestructure.Trips;
using DDDNetCore.DriverDuties.Domain;
using DDDNetCore.Infraestructure.DriverDuties;
using DDDNetCore.Infraestructure.VehicleDuties;
using DDDNetCore.VehicleDuties.Domain;
using DDDNetCore.WorkBlocks.Domain;
using DDDNetCore.Infraestructure.WorkBlocks;

namespace DDDSample1.Infrastructure
{
    public class MDVDbContext : DbContext
    {
      
        public DbSet<Vehicle> Vehicles { get; set; }

        public DbSet<VehicleDuty> VehicleDuties { get; set; }

        public DbSet<Driver> Drivers { get; set; }

        public DbSet<DriverDuty> DriverDuties { get; set; }

        public DbSet<Role> Roles { get; set; }

        public DbSet<User> Users { get; set; }
        public DbSet<Trip> Trips { get; set; }

        public DbSet<WorkBlock> WorkBlocks { get; set; }

        public MDVDbContext(DbContextOptions options) : base(options)
        {

        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            
            modelBuilder.ApplyConfiguration(new RoleEntityTypeConfiguration());
            modelBuilder.ApplyConfiguration(new UserEntityTypeConfiguration());
            modelBuilder.ApplyConfiguration(new VehicleEntityTypeConfiguration());
            modelBuilder.ApplyConfiguration(new VehicleDutyEntityTypeConfiguration());
            modelBuilder.ApplyConfiguration(new DriverEntityTypeConfiguration());
            modelBuilder.ApplyConfiguration(new DriverDutyEntityTypeConfiguration());
            modelBuilder.ApplyConfiguration(new TripEntityTypeConfiguration());
            modelBuilder.ApplyConfiguration(new WorkBlockEntityTypeConfiguration());
        }
    }
}