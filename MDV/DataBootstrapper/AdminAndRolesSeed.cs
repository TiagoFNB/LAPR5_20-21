using DDDNetCore.Utils.Email;
using DDDSample1.Domain.Roles;
using DDDSample1.Domain.Shared;
using DDDSample1.Domain.Users;
using DDDSample1.Infrastructure;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DDDNetCore.DataBootstrapper
{
    public class AdminAndRolesSeed
    {

        // private readonly IUnitOfWork _unitOfWork;

        //private readonly IRoleRepository _repoRoles;

        private readonly MDVDbContext _cont;
        private readonly IPasswordHasher<User> _passwordHasher;
        private readonly ISendEmail _sendEmail; 
        public AdminAndRolesSeed(MDVDbContext cont, IPasswordHasher<User> passwordHasher, ISendEmail sendEmail)
        {
            this._cont = cont;
            this._passwordHasher = passwordHasher;
            this._sendEmail = sendEmail;


        }

        public void seedAll()
        {
            seedRole();
            seedAdmin();
        }

        public  void seedRole()
        {
            if (_cont.Database.CanConnect())
            {
                if (!_cont.Roles.Any())
                {
                    Role role = new Role("Admin");
                    _cont.Add<Role>(role);
                    role = new Role("Manager");
                    _cont.Add<Role>(role);
                    role = new Role("User");
                    _cont.Add<Role>(role);
                    _cont.SaveChanges();
                }
            }
        }

            public  void seedAdmin()
            {
                if (_cont.Database.CanConnect())
                {
                    if (!_cont.Users.Any())
                    {
                        DateTime d = new DateTime(1993, 7, 21, 0, 0, 0);
                    
                    string userEmail = "rogernio@gmail.com";
                    string password = passwordGenerator();
                        User user = new User("Rogerio", userEmail, "Alexandrino Chaves Velho","Freamunde", "Portugal", d);

                        string hashedPassword = _passwordHasher.HashPassword(user, password);

                        user.DefineHashedPassword(hashedPassword);
                    user.DefineRole("Admin");

                    _cont.Add<User>(user);
                    _cont.SaveChanges();
                    _sendEmail.sendEmail(userEmail, "Opt password", password);


                     d = new DateTime(1993, 7, 21, 0, 0, 0);

                     userEmail = "mdv.g039@gmail.com";
                     password = passwordGenerator();
                     user = new User("Rogerio", userEmail, "Alexandrino Chaves Velho", "Freamunde", "Portugal", d);

                     hashedPassword = _passwordHasher.HashPassword(user, password);

                    user.DefineHashedPassword(hashedPassword);
                    user.DefineRole("Admin");

                    _cont.Add<User>(user);
                    
                  Boolean b=  _sendEmail.sendEmail(userEmail, "Opt password: ", password);
                    if (b)
                    {
                        _cont.SaveChanges();
                       
                    }
                    else
                    {
                        Debug.Write("Did not bootstraped admin users becouse email with the random generated password could not be sent");
                    }
                   
                }
                }
            }

        private string passwordGenerator()
        {
            StringBuilder builder = new StringBuilder();
            Random random = new Random();
            char ch;
            for (int i = 0; i < 7; i++)
            {
                ch = Convert.ToChar(Convert.ToInt32(Math.Floor(26 * random.NextDouble() + 65)));
                builder.Append(ch);
            }
            
            return builder.ToString();
        }
    }
}
