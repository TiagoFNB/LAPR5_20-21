using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DDDNetCore.Utils.Email
{
    public interface ISendEmail
    {
        public Boolean sendEmail(string receiver, string subject, string body);
    }
}
