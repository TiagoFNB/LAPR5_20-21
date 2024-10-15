using DDDSample1.Domain.Roles;
using Microsoft.AspNetCore.Identity;
using System;
using System.Threading.Tasks;

namespace DDDSample1.Domain.Users
{
    public class UserMapper : IUserMapper
    {

       
       
        private  IPasswordHasher<User> _hasher;
        public UserMapper( IPasswordHasher<User> passwordHasher)
        {
           
           
            _hasher = passwordHasher;
        }

        public User MapFromRegisterUserDtoToDomain(RegisterUserDto registerUserDto)
        {
            if (registerUserDto.Password.Length > 5)
            {
               User user = new User(registerUserDto.Name, registerUserDto.Email, registerUserDto.Street, registerUserDto.City, registerUserDto.Country, registerUserDto.DateOfBirth);
                string hashedPassword = _hasher.HashPassword(user, registerUserDto.Password);
                user.DefineHashedPassword(hashedPassword);
                return user;
            }
            else
            {
                throw new Exception("Password must be six characters length");
               
            }
            
        }


        public LoginResultDto MapFromDomainToLoginResult(User user, string token)
        {
            LoginResultDto loginResultDto = new LoginResultDto(user.Email.Email, user.RoleName.Value, token, user.Name.Name);
            return loginResultDto;

        }


        //public async Task<UserDataSchema> MapFromDomainToPersistence(User user)
        //{
        //  RoleDataSchema roleDataSchema = await  _roleRepo.GetByNameAsync(user.RoleName.Name);
        //    if (roleDataSchema == null)
        //    {
        //        throw new Exception("That role doesnt exists");
        //    }
        // // var role=  _roleMapper.FromPersistence2Domain(roleDataSchema);
        //   UserDataSchema userDataSchema = new UserDataSchema(user.Id.AsString(), user.Name.Name, user.Email.Email, user.Address.Street, user.Address.City, user.Address.Country, user.HashedPassword, roleDataSchema.Name);



        //    return userDataSchema;
        //}


        //public User MapFromPersistenceToDomain(UserDataSchema userDataSchema)
        //{



        //    return new User(userDataSchema.Id.AsString(), userDataSchema.Name, userDataSchema.Email, userDataSchema.Street, userDataSchema.City, userDataSchema.Country, userDataSchema.HashedPassword, userDataSchema.Role.Name);
        //}

        public RegisterUserDto MapFromDomain2Dto(User user)
        {
            RegisterUserDto registerUserDto = new RegisterUserDto(user.Name.Name, user.Email.Email, user.Address.Street, user.Address.City, user.Address.Country, user.RoleName.Value, user.UserDataOfBirth.dateOfBirth);
           
            return registerUserDto;
        }



    }
}
