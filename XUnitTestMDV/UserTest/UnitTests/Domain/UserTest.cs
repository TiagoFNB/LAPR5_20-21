using DDDSample1.Domain.Users;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Xunit;
namespace XUnitTestMDV.UserTest.Domain
{
  public  class UserTest
    {

        [Fact]
        public void ShouldCreateUser1()
        {
            DateTime d = new DateTime(2002, 10, 18);


            User user = new User("name1", "email1@gmail.com", "street", "city","country", d);
            Assert.Equal("name1", user.Name.Name);
            Assert.Equal("email1@gmail.com", user.Email.Email);
            Assert.Equal("street", user.Address.Street);
            Assert.Equal("city", user.Address.City);
            Assert.Equal("country", user.Address.Country);
           
            Assert.Equal(d.ToShortDateString(), user.UserDataOfBirth.ToString());
        }


        [Fact]
        public void ShouldNotCreateUser() //invalid name
        {
            DateTime d = new DateTime(2002, 10, 18);


           
            Assert.Throws<Exception>(() => new  User("n", "email1@gmail.com", "street", "city", "country", d));
        }

        [Fact]
        public void ShouldNotCreateUser2() //invalid email  lacks .*
        {
            DateTime d = new DateTime(2002, 10, 18);



            Assert.Throws<Exception>(() => new User("n", "email1@gmail", "street", "city", "country", d));
        }

        [Fact]
        public void ShouldNotCreateUser3() //invalid street 
        {
            DateTime d = new DateTime(2002, 10, 18);



            Assert.Throws<Exception>(() => new User("n", "email1@gmail.com", "s", "city", "country", d));
        }

        [Fact]
        public void ShouldNotCreateUser4() //invalid city 
        {
            DateTime d = new DateTime(2002, 10, 18);



            Assert.Throws<Exception>(() => new User("n", "email1@gmail.com", "street", "c", "country", d));
        }


        [Fact]
        public void ShouldNotCreateUser5() //invalid country 
        {
            DateTime d = new DateTime(2002, 10, 18);



            Assert.Throws<Exception>(() => new User("n", "email1@gmail.com", "street", "city", "c", d));
        }


        [Fact]
        public void ShouldNotCreateUser6() //invalid date 
        {
            DateTime d = new DateTime(200218);
           


            Assert.Throws<Exception>(() => new User("n", "email1@gmail.com", "street", "city", "c", d));
        }




    }
}
