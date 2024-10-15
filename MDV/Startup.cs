using System;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using DDDSample1.Infrastructure;
using DDDSample1.Infrastructure.Categories;


using DDDSample1.Infrastructure.Shared;
using DDDSample1.Domain.Shared;

using DDDSample1.Domain.Users;
using DDDSample1.Domain.Roles;
using System.Diagnostics;
using Microsoft.AspNetCore.Identity;
using DDDNetCore.Utils.Jwt;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using DDDNetCore.DataBootstrapper;
using DDDNetCore.Drivers.Mappers;
using DDDNetCore.Drivers.Repository;
using DDDNetCore.Drivers.Services;
using DDDNetCore.Infraestructure.Drivers;
using DDDNetCore.Infraestructure.Vehicles;
using DDDNetCore.Utils.Email;
using DDDNetCore.Trips.Services;
using DDDNetCore.Trips.Repository;
using DDDNetCore.Vehicles.Mappers;
using DDDNetCore.Vehicles.Repository;
using DDDNetCore.Vehicles.Services;
using DDDNetCore.DriverDuties.Repository;
using DDDNetCore.Infraestructure.DriverDuties;
using DDDNetCore.DriverDuties.Services;
using DDDNetCore.DriverDuties.Mappers;
using DDDNetCore.Infraestructure.Trips;
using DDDNetCore.Infraestructure.VehicleDuties;
using DDDNetCore.VehicleDuties.Mappers;
using DDDNetCore.VehicleDuties.Repository;
using DDDNetCore.VehicleDuties.Services;
using DDDNetCore.Infraestructure.WorkBlocks;
using DDDNetCore.WorkBlocks.Repository;
using DDDNetCore.WorkBlocks.Services;
using DDDNetCore.WorkBlocks.Mappers;
using DDDNetCore.Lines.Mappers;
using DDDNetCore.ImportFile.Services;

namespace DDDSample1
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            ConfigureCors(services);
            ConfigureMySecurity(services); // password hasher and JWT bearer
            ConfigureEmailService(services);
            ConfigureMyDataBootstrapper(services);
            ConfigureOtherApisOrSpaLinks(services);

           
            //services.AddDbContext<MDVDbContext>(opt =>
            //    opt.UseInMemoryDatabase("DDDSample1DB")
            //    .ReplaceService<IValueConverterSelector, StronglyEntityIdValueConverterSelector>());

            services.AddDbContext<MDVDbContext>(opt =>
              opt.UseSqlServer(Configuration.GetConnectionString("Db"))         //or AzureDb
                .ReplaceService<IValueConverterSelector, StronglyEntityIdValueConverterSelector>());

            ConfigureMyServices(services);
           
            services.AddSwaggerGen();

            services.AddControllers().AddNewtonsoftJson();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env, AdminAndRolesSeed roleseed)
        {
            roleseed.seedAll();
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }
            
            app.UseCors("MyPolicy");
            app.UseAuthentication();
            app.UseHttpsRedirection();


            // Enable middleware to serve generated Swagger as a JSON endpoint.
            app.UseSwagger();

            // Enable middleware to serve swagger-ui (HTML, JS, CSS, etc.),
            // specifying the Swagger JSON endpoint.
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "My API V1");
                c.RoutePrefix = string.Empty;
            });
           
            app.UseRouting();
            app.UseAuthorization();
            //app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }

        public void ConfigureMyServices(IServiceCollection services)
        {
            services.AddTransient<IUnitOfWork,UnitOfWork>();


            services.AddTransient<IUserRepository, UserRepository>();
            services.AddTransient<IUserService, UserService>();
            services.AddTransient<IUserMapper, UserMapper>();

            services.AddTransient<IVehicleMapper, VehicleMapper>();
            services.AddTransient<IVehicleService, VehicleService>();
            services.AddTransient<IVehicleRepository, VehicleRepository>();

            services.AddTransient<IVehicleDutyRepository, VehicleDutyRepository>();
            services.AddTransient<IVehicleDutyService, VehicleDutyService>();
            services.AddTransient<IListVehicleDutiesService, ListVehicleDutiesService>();
            services.AddTransient<IVehicleDutyMapper, VehicleDutyMapper>();

            services.AddTransient<IDriverRepository, DriverRepository>();
             services.AddTransient<IDriverService, DriverService>();
             services.AddTransient<IDriverMapper, DriverMapper>();

            services.AddTransient<IRoleRepository, RoleRepository>();
            services.AddTransient<IRoleService, RoleService>();
            services.AddTransient<IRoleMapper, RoleMapper>();

            services.AddTransient<IDriverDutyRepository, DriverDutyRepository>();
            services.AddTransient<IDriverDutyService, DriverDutyService>();
            services.AddTransient<IListDriverDutiesService, ListDriverDutiesService>();
            services.AddTransient<IDriverDutyMapper, DriverDutyMapper>();

            services.AddTransient<ITripRepository, TripRepository>();
            services.AddTransient<IRegisterTripService, RegisterTripService>();
            services.AddTransient<IListTripsService, ListTripsService>();
            services.AddTransient<IListTripsByLineService, ListTripsByLineService>();
            services.AddTransient<ITripMapper, TripMapper>();

            services.AddTransient<ILineMapper, LineMapper>();

            services.AddTransient<IWorkBlockRepository, WorkBlockRepository>();
            services.AddTransient<IWorkBlocksOfVehicleDutyService, WorkBlocksOfVehicleDutyService>();
            services.AddTransient<IListWorkBlocksService, ListWorkBlocksService>();
            services.AddTransient<IGetListWorkBlocksByVehicleDutyService, GetListWorkBlocksByVehicleDutyService>();
            services.AddTransient<IGetListWorkBlocksByDriverDutyService, GetListWorkBlocksByDriverDutyService>();
            services.AddTransient<IAffectDriverDutyToWorkBlockService, AffectDriverDutyToWorkBlockService>();
            services.AddTransient<IGetWorkBlockByIdService, GetWorkBlockByIdService>();
            

            services.AddTransient<IWorkBlockMapper, WorkBlockMapper>();

            services.AddTransient<ImportGlxServiceInterface, ImportGlxService>();

        }

      public void ConfigureMySecurity(IServiceCollection services)
        {
            var jwtOptions = new JwtOptions();
            Configuration.GetSection("jwt").Bind(jwtOptions); // bind te configuration settings of appsettings.json to our jwtOptions

            services.AddSingleton(jwtOptions);

            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = "Bearer";
                options.DefaultAuthenticateScheme = "Bearer";
                options.DefaultChallengeScheme = "Bearer";
            }
                ).AddJwtBearer(cfg =>
                {
                    cfg.RequireHttpsMetadata = false;
                    cfg.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidIssuer = jwtOptions.JwtIssuer,
                        ValidAudience = jwtOptions.JwtIssuer,
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtOptions.JwtKey))
                    };
                });

            services.AddScoped<IJwtProvider, JwtProvider>();
            services.AddScoped<IPasswordHasher<User>, PasswordHasher<User>>();
           
        }

        public void ConfigureMyDataBootstrapper(IServiceCollection services)
        {
            services.AddTransient<AdminAndRolesSeed>();
           

        }


        public void ConfigureEmailService(IServiceCollection services)
        {
            //var notificationMetadata =
            //Configuration.GetSection("NotificationMetadata").
            //Get<NotificationMetadata>();
            //services.AddSingleton(notificationMetadata);
            //services.AddControllers();
            //services.AddScoped<EmailMessage>();
            services.AddScoped<ISendEmail, SendEmail>();
        }
        public void ConfigureCors(IServiceCollection services)
        {
            services.AddCors(o => o.AddPolicy("MyPolicy", builder =>
            {
                builder.AllowAnyOrigin()
                       .AllowAnyMethod()
                       .AllowAnyHeader();
            }));

        }


        public void ConfigureOtherApisOrSpaLinks(IServiceCollection services)
        {

            services.AddHttpClient("mdr", c =>
            {
                c.BaseAddress = new Uri(Configuration["apisAndSpa:mdr"]);
            });

            //services.AddHttpClient("mdrHeroku", c =>
            //{
            //    c.BaseAddress = new Uri("https://lapr5-20s5-mdr.herokuapp.com/api/");
            //});

        }
    }
    


}
