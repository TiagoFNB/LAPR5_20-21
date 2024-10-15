using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

namespace DDDSample1.Controllers
{
    public class APIErrorHandling
    {


        public static ActionResult Result(HttpStatusCode statusCode, string reason) => new ContentResult
        {
            StatusCode = (int)statusCode,
            Content = reason,
            ContentType = "Json",
        };

        public static ActionResult Result(HttpStatusCode statusCode, Object reason) => new ContentResult
        {
            StatusCode = (int)statusCode,
            Content = reason.ToString(),
            ContentType = "Json",
        };
    }
}
