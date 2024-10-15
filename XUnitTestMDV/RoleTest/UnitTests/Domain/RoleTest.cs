using DDDSample1.Domain.Roles;
using System;
using Xunit;

namespace XUnitTestMDV
{
    public class RoleTestD
    {
        [Fact]
        public void ShouldCreateRole1()
        {
            string rName = "roleTest1";
            DDDSample1.Domain.Roles.Role role = new DDDSample1.Domain.Roles.Role(rName);
            Assert.Equal(rName, role.Id.Value);
        }


        [Fact]
        public void ShouldNotRole1()
        {
            string rName = null;
           
           

            Assert.Throws<NullReferenceException>(() => new DDDSample1.Domain.Roles.Role(rName));
        }


        [Fact]
        public void ShouldNotRole2()
        {
            string rName = "cc";



            Assert.Throws<InvalidOperationException>(() => new DDDSample1.Domain.Roles.Role(rName));
        }


        [Fact]
        public void ShouldNotRole3()
        {
            string rName = "12345678901234567890";



            Assert.Throws<InvalidOperationException>(() => new DDDSample1.Domain.Roles.Role(rName));
        }



    }
}
