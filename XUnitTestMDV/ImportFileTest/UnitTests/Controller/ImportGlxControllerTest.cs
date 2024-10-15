using DDDNetCore.ImportFile.Controllers;
using DDDNetCore.ImportFile.Dto;
using DDDNetCore.ImportFile.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml;
using Xunit;

namespace XUnitTestMDV.ImportFileTest.UnitTests
{
   public class ImportGlxControllerTest
    {
        [Fact]
        public async void ShouldImportWithSucessAndNoErros() {
            //Mocking file
            var fileMock = new Mock<IFormFile>();
            //Setup mock file using a memory stream
            var content = "MockedFile";
            var fileName = "test.xml";
            var ms = new MemoryStream();
            var writer = new StreamWriter(ms);
            writer.Write(content);
            writer.Flush();
            ms.Position = 0;
            fileMock.Setup(_ => _.OpenReadStream()).Returns(ms);
            fileMock.Setup(_ => _.FileName).Returns(fileName);
            fileMock.Setup(_ => _.Length).Returns(ms.Length);

            var httpContext = new DefaultHttpContext();
            httpContext.Request.Headers["Authorization"] = "test";
           
           



            List<string> errorList = new List<string>();
            ImportFileReplyDto dto = new ImportFileReplyDto(errorList, 400,400);

            string filePath = Path.GetTempFileName();
        var ImportGlxService = new Mock<ImportGlxServiceInterface>();
            ImportGlxService.Setup(o => o.ImportGlx(It.IsAny<string>(), "test"))
              .Returns(Task.FromResult(dto));



            


            var controller = new ImportGlxController(ImportGlxService.Object)
            {
                ControllerContext = new ControllerContext()
                {
                    HttpContext = httpContext
                }
            };


            var result = await controller.ImportGlx(fileMock.Object);


            Assert.IsType<OkObjectResult>(result);

            OkObjectResult okRes = (OkObjectResult)result;

            
            Assert.Same(dto, okRes.Value);
            


        }


        [Fact]
        public async void ShouldImportWithSucessAndWithListOfErrorsWithSomeErrors()
        {
            //Mocking file
            var fileMock = new Mock<IFormFile>();
            //Setup mock file using a memory stream
            var content = "MockedFile";
            var fileName = "test.xml";
            var ms = new MemoryStream();
            var writer = new StreamWriter(ms);
            writer.Write(content);
            writer.Flush();
            ms.Position = 0;
            fileMock.Setup(_ => _.OpenReadStream()).Returns(ms);
            fileMock.Setup(_ => _.FileName).Returns(fileName);
            fileMock.Setup(_ => _.Length).Returns(ms.Length);

            var httpContext = new DefaultHttpContext();
            httpContext.Request.Headers["Authorization"] = "test";





            List<string> errorList = new List<string>();
            errorList.Add("one error");
            ImportFileReplyDto dto = new ImportFileReplyDto(errorList, 400, 400);

            string filePath = Path.GetTempFileName();
            var ImportGlxService = new Mock<ImportGlxServiceInterface>();
            ImportGlxService.Setup(o => o.ImportGlx(It.IsAny<string>(), "test"))
              .Returns(Task.FromResult(dto));






            var controller = new ImportGlxController(ImportGlxService.Object)
            {
                ControllerContext = new ControllerContext()
                {
                    HttpContext = httpContext
                }
            };


            var result = await controller.ImportGlx(fileMock.Object);


            Assert.IsType<OkObjectResult>(result);

            OkObjectResult okRes = (OkObjectResult)result;

            
            Assert.Same(dto, okRes.Value);



        }


      


        [Fact]
        public async void ShouldNotImportWithSucess_FileTypeIsInvalid()
        {
            //Mocking file
            var fileMock = new Mock<IFormFile>();
            //Setup mock file using a memory stream
            var content = "MockedFile";
            var fileName = "test.png";
            var ms = new MemoryStream();
            var writer = new StreamWriter(ms);
            writer.Write(content);
            writer.Flush();
            ms.Position = 0;
            fileMock.Setup(_ => _.OpenReadStream()).Returns(ms);
            fileMock.Setup(_ => _.FileName).Returns(fileName);
            fileMock.Setup(_ => _.Length).Returns(ms.Length);

            var httpContext = new DefaultHttpContext();
            httpContext.Request.Headers["Authorization"] = "test";


            List<string> errorList = new List<string>();
            errorList.Add("one error");
            ImportFileReplyDto dto = new ImportFileReplyDto(errorList, 2, 0);

            string filePath = Path.GetTempFileName();
            var ImportGlxService = new Mock<ImportGlxServiceInterface>();
            ImportGlxService.Setup(o => o.ImportGlx(It.IsAny<string>(), "test"))
            .Throws(new XmlException());  // exception thrown becouse file is invalid, its not a XML file



            var controller = new ImportGlxController(ImportGlxService.Object)
            {
                ControllerContext = new ControllerContext()
                {
                    HttpContext = httpContext
                }
            };

            var result = await controller.ImportGlx(fileMock.Object);

            


            BadRequestObjectResult okRes = (BadRequestObjectResult)result;

            Assert.Equal(400, okRes.StatusCode);
            Assert.IsType<BadRequestObjectResult>(result);

            Assert.Equal(0, ((ImportFileReplyDto)(okRes.Value)).errorList.Count);
            Assert.Equal(0, ((ImportFileReplyDto)(okRes.Value)).numberOfErros);
            Assert.Equal(0, ((ImportFileReplyDto)(okRes.Value)).NumbersOfObjectsImported);


        }

    }
}
