

using DDDSample1.Domain.Shared;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DDDSample1.Domain.Users
{
    public interface IUserRepository : IRepository<User, UserId>
    {
        public  Task<User> GetByEmailAsync(string email);
        public User UpdateUser(User user);
       // public Task<User> LoginAuthentication(string email, string password); 

    }
}
