using DDDSample1.Domain.Roles;
using DDDSample1.Domain.Shared;
using System;
using System.ComponentModel.DataAnnotations;

namespace DDDSample1.Domain.Users //DDDNetCore.Domain
{
    public class User : Entity<UserId>, IAggregateRoot
    {
        public UserEmail Email { get; private set; }
        public UserName Name { get; private set; }

       

        public UserAddress Address { get; private set; }

        public string HashedPassword { get; private set; }

        public DateOfBirth UserDataOfBirth { get; private set; }
        
        public RoleName RoleName { get;  private set; }

        

        


        public User(string name, string email, string street, string city, string country, DateTime dateOfBirth )
        {
            this.Id = new UserId(Guid.NewGuid());
            // this.Id = new UserId(Guid.NewGuid());
            Email = new UserEmail(email);
            Name = new UserName(name);
          
           Address = new UserAddress(street, city, country);
           
            RoleName = new RoleName("User");
            UserDataOfBirth = new DateOfBirth(dateOfBirth);
        }


        //public User(string userId, string name, string email, string street, string city, string country, string hashedPassword, string roleName)
        //{
        //    this.Id = new UserId(userId);
        //    Name = new UserName(name);
        //    Email = new UserEmail(email);
        //    Address = new UserAddress(street, city, country);
        //    HashedPassword = hashedPassword;
        //    RoleName = new RoleName(roleName);
        //}
        private User()
        {

        }

        public void DefineHashedPassword(string hash)
        {
            this.HashedPassword = hash;
        }

        public void DefineRole(string roleName)
        {
            this.RoleName = new RoleName(roleName);
        }

        public void DeleteFromSystem()
        {
            this.RoleName = null;
            this.Email = null;
            this.Name = null;
            this.Address = null;
            this.HashedPassword = null;
            this.UserDataOfBirth = null;

        }

    }
}
