

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DDDSample1.Domain.Users
{
    public interface IUserMapper
    {
        //public User MapFromRegisterUserDtoToDomain(RegisterUserDto registerUserDto);
        //public UserDataSchema MapFromDomainToPersistence(User user);
        //public RegisterUserDto MapFromDomain2Dto(User user);


        public User MapFromRegisterUserDtoToDomain(RegisterUserDto registerUserDto);
        //public Task<UserDataSchema> MapFromDomainToPersistence(User user);
        //public User MapFromPersistenceToDomain(UserDataSchema userDataSchema);
        public RegisterUserDto MapFromDomain2Dto(User user);
        public LoginResultDto MapFromDomainToLoginResult(User user, string token);
    }
}
