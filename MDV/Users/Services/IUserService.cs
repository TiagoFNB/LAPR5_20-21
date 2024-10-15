
using DDDNetCore.Users.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DDDSample1.Domain.Users
{
    public interface IUserService
    {
        public Task<RegisterUserDto> AddAsync(RegisterUserDto dto);
        public  Task<LoginResultDto> LoginUser(LoginUserDto loginUserDto);
        public  Task<EditUserDto> EditUser(EditUserDto editUserDto);
        public  Task<RegisterUserDto> GetUserByEmail(string email);

        public Task<Boolean> retrievePassword(string email);
        public  Task<Boolean> ForgetUser(ForgetUserDto dto);
    }
}
