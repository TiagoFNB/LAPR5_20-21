using MailKit.Net.Smtp;
using MimeKit;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;

namespace DDDNetCore.Utils.Email
{
    public class SendEmail : ISendEmail
    {



        public Boolean sendEmail(string receiver, string subject, string body)
        {
            var message = new MimeMessage();
            message.From.Add(new MailboxAddress("optmdvapi@gmail.com"));
            message.To.Add(new MailboxAddress(receiver));
            message.Subject = subject;
            message.Body = new TextPart(MimeKit.Text.TextFormat.Text)
            { Text ="Your OPT password: "+ body +" Travel safely"};

            try
            {

        
            using (var client = new SmtpClient())
            {

                client.ServerCertificateValidationCallback = (sender, certificate, chain, sslPolicyErrors) => {

                    

                    return true;
                };


                client.Connect("smtp.gmail.com", 587, false);
                client.Authenticate("optmdvapi@gmail.com", "OPTMDV123");
                client.Send(message);
                client.Disconnect(true);
                    return true;
            }
            }
            catch (Exception e)
            {
                
                Debug.Write("Could not send email. LOG: "+e.Message  +" Detailed error"+e.InnerException);
                return false;
            }
        }
    }
}
