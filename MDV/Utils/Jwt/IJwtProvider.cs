using DDDSample1.Domain.Users;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DDDNetCore.Utils.Jwt
{
    public interface IJwtProvider
    {
       
            string GenerateJwtToken(User user);
       
    }
}
