using DDDSample1.Domain.Roles;
using DDDSample1.Infrastructure.Shared;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using System.Linq;

namespace DDDSample1.Infrastructure.Categories
{
    public class RoleRepository : BaseRepository<Role, RoleName>, IRoleRepository
    {
        private readonly DbSet<Role> _objs;

       

        public RoleRepository(MDVDbContext context) : base(context.Roles)
        {

         
            this._objs = context.Roles;



        }



    }
}