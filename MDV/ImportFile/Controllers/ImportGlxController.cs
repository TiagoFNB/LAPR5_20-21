using DDDSample1.Domain.Users;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Net;
using System.Threading.Tasks;
using Newtonsoft.Json.Linq;
using DDDNetCore.ImportFile.Services;
using DDDSample1.Controllers;
using Microsoft.AspNetCore.Http;
using System.IO;
using Microsoft.Extensions.Primitives;
using DDDNetCore.Trips.Services;
using DDDNetCore.VehicleDuties.Services;
using DDDNetCore.DriverDuties.Services;
using DDDNetCore.WorkBlocks.Services;
using Microsoft.AspNetCore.Authorization;
using System.Collections.Generic;
using DDDNetCore.ImportFile.Dto;
using System.Xml;

namespace DDDNetCore.ImportFile.Controllers
{

    [Route("mdvapi/ImportGlx")]
    [ApiController]
    public class ImportGlxController : ControllerBase
    {

        // private readonly IUserService _service;

       
        private readonly ImportGlxServiceInterface _ImportService;
        public ImportGlxController(ImportGlxServiceInterface ImportService)
        {
            
            _ImportService = ImportService;
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> ImportGlx(IFormFile file)
        {
            ImportFileReplyDto dto = new ImportFileReplyDto();
            if (file == null)
            {
                dto.message = "No file was sent, please send an XML file";
                return BadRequest(dto);
            }

            // Gets the Auth token
            StringValues authorizationToken;
            this.Request.Headers.TryGetValue("Authorization", out authorizationToken); 
            string token = authorizationToken;


            //write the file received in a temporary location and send that location to service to be able to read that file
            string filePath = Path.GetTempFileName();
            if (file.Length > 0)
            { 
                using (var stream = new FileStream(filePath, FileMode.Create)) 

            await file.CopyToAsync(stream);
            }
           
            try
            {
                 dto = await _ImportService.ImportGlx(filePath, token);
            }
            catch (XmlException e)
            {
                dto.message = "The file type is not supported, it must be a valid XML file";
                return BadRequest(dto);
            }
            



           
                return Ok(dto); // status code 200 if there was atleast one object imported
            
            
           
        }

    }

}
