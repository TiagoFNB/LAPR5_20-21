
using DDDSample1.Domain.Users;
using DDDSample1.Infrastructure.Shared;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using System.Linq;
namespace DDDSample1.Infrastructure.Categories
{
    public class UserRepository : BaseRepository<User, UserId>, IUserRepository
    {
        private readonly DbSet<User> _objs;
        public UserRepository(MDVDbContext context):base(context.Users)
        {
            this._objs = context.Users;
        }


     //   Comented cuz now Emial is the Pk
        public async Task<User> GetByEmailAsync(string email)
        {
            //return await this._context.Categories.FindAsync(id);
            User user = await this._objs
                .Where(x => email.Equals(x.Email.Email)).FirstOrDefaultAsync<User>();



            return user;
        }


        public  User UpdateUser(User user)
        {
            //return await this._context.Categories.FindAsync(id);
             this._objs.Update(user);
             


            return user;
        }
        //public async Task<User> LoginAuthentication(string email, string password)
        //{
        //    //return await this._context.Categories.FindAsync(id);
        //    User user = await this._objs
        //        .Where(x => email.Equals(x.Email.Email)).FirstOrDefaultAsync<User>();

        //    return user;
        //}



    }
}