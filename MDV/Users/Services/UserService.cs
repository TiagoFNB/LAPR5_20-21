
using DDDNetCore.Users.Dtos;
using DDDNetCore.Utils.Email;
using DDDNetCore.Utils.Jwt;
using DDDSample1.Domain.Roles;
using DDDSample1.Domain.Shared;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace DDDSample1.Domain.Users
{
    public class UserService : IUserService
    {

        private readonly IUnitOfWork _unitOfWork;
        private readonly IUserRepository _repo;
        private readonly IRoleRepository _repoRoles;
        private readonly IUserMapper _mapper;
        private IPasswordHasher<User> _hasher;
        private IJwtProvider _jwtProvider;
        private ISendEmail _emailSender;
        public UserService(IUnitOfWork unitOfWork, IUserRepository repo, IUserMapper mapper, IRoleRepository repoRoles, IPasswordHasher<User> passwordHasher, IJwtProvider jwtProvider, ISendEmail emailSender)
        {
            this._unitOfWork = unitOfWork;
            this._repo = repo;
            this._mapper = mapper;
            this._repoRoles = repoRoles;
            this._hasher = passwordHasher;
            this._jwtProvider = jwtProvider;
            this._emailSender = emailSender;

    }
        public async Task<RegisterUserDto> AddAsync(RegisterUserDto dto)
        {
           
            User user = _mapper.MapFromRegisterUserDtoToDomain(dto);

            Role role =await _repoRoles.GetByIdAsync(user.RoleName);
            if(role == null){
                throw new Exception("That role dosent exists, contact the administrators becouse User should be a default role");
            }
            var globalValidation = await GetUserByEmail(user.Email.Email);

            if (globalValidation != null)
            {
                throw new Exception("That user already exists in the system");
            }

            // userSchema =  await _mapper.MapFromDomainToPersistence(user);

            await this._repo.AddAsync(user);

            await this._unitOfWork.CommitAsync();

          
            RegisterUserDto registerUserDto = _mapper.MapFromDomain2Dto(user);

            return registerUserDto;


        }

        public async Task<RegisterUserDto> GetUserByEmail(string email)
        {
            User user = await this._repo.GetByEmailAsync(email);
            if (user != null)
            {
                // var role = _mapper.FromPersistence2Domain(roleDataSchema);
                var userDto = _mapper.MapFromDomain2Dto(user);
                return userDto;
            }
            return null;

        }


        public async Task<LoginResultDto> LoginUser(LoginUserDto loginUserDto)
        {
            User user = await this._repo.GetByEmailAsync(loginUserDto.Email);
            if (user == null)
            {
                throw new Exception("Invalid email or password"); // to not disclousure that is the email is invalid for security purposes
               
            }
          var passwordVerificationResult=  _hasher.VerifyHashedPassword(user,user.HashedPassword, loginUserDto.Password);
           if(passwordVerificationResult == PasswordVerificationResult.Failed)
            {
                throw new Exception("Invalid email or password"); //to not disclousure that is the password is invalid for security purposes
            }

          string token =  _jwtProvider.GenerateJwtToken(user);
           LoginResultDto loginResult = _mapper.MapFromDomainToLoginResult(user, token);
            return loginResult;
        }



        public async Task<EditUserDto> EditUser(EditUserDto editUserDto)
        {
            User user = await this._repo.GetByEmailAsync(editUserDto.Email);
            if (user == null)
            {
                throw new Exception(" User dosent exists"); 

            }

            Role role = await this._repoRoles.GetByIdAsync(new RoleName(editUserDto.Role));
            if (role == null)
            {
                throw new Exception("Role dosent exists"); 

            }
            user.DefineRole(editUserDto.Role);
           
             this._repo.UpdateUser(user);
            await this._unitOfWork.CommitAsync();
            return editUserDto;

        }

        public async Task<Boolean> retrievePassword(string email)
        {

            User user = await this._repo.GetByEmailAsync(email);
            if (user == null)
            {
                throw new Exception(" User dosent exists"); 

            }
            else
            {
                string generated = passwordGenerator();
                string hashedPassword = _hasher.HashPassword(user, generated);

                user.DefineHashedPassword(hashedPassword);

               
                    this._repo.UpdateUser(user);


                Boolean emailSend = _emailSender.sendEmail(user.Email.Email, "your new access for opt ", "Your new password is :" + generated);

                 if (emailSend)
                {
                    await this._unitOfWork.CommitAsync(); // will commit if email is sent else its not worth to change
                    return true;
                }


                return false;

            }

        }


        public async Task<Boolean> ForgetUser(ForgetUserDto dto)
        {

            if(dto.Email==null || dto.Email == "" || dto.Password == null || dto.Password == "")
            {
                throw new Exception("Please specify your email and/or your password ");
            }

            User user = await this._repo.GetByEmailAsync(dto.Email);
            if (user == null)
            {
                throw new Exception("User dosent exists");

            }
           

            var passwordVerificationResult = _hasher.VerifyHashedPassword(user, user.HashedPassword, dto.Password);
            if (passwordVerificationResult == PasswordVerificationResult.Failed)
            {
                throw new Exception("Invalid password"); //to not disclousure that is the password is invalid for security purposes
            }


            user.DeleteFromSystem();
            this._repo.UpdateUser(user);
            await this._unitOfWork.CommitAsync();
            return true;

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
