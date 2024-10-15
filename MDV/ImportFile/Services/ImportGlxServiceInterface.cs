using DDDNetCore.ImportFile.Dto;
using DDDNetCore.ImportFile.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Xml;

namespace DDDNetCore.ImportFile.Services
{
    public interface ImportGlxServiceInterface
    {

        public  Task<ImportFileReplyDto> ImportGlx(string filepath, string token);
        
        
    }
}
