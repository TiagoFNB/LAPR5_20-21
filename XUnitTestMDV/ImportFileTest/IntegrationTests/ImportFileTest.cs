using DDDNetCore.DriverDuties.Dto;
using DDDNetCore.DriverDuties.Services;
using DDDNetCore.ImportFile.Controllers;
using DDDNetCore.ImportFile.Dto;
using DDDNetCore.ImportFile.Services;
using DDDNetCore.Trips.Domain.ValueObjects;
using DDDNetCore.Trips.DTO;
using DDDNetCore.Trips.Services;
using DDDNetCore.VehicleDuties.Dto;
using DDDNetCore.VehicleDuties.Services;
using DDDNetCore.WorkBlocks.Dto;
using DDDNetCore.WorkBlocks.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Moq.Protected;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Xunit;

namespace XUnitTestMDV.ImportFileTest.IntegrationTests
{
    public class ImportFileTest
    {

        [Fact]
        public async void ShouldImportFileWithNoErrors()
        {

            //mocking register trip service
            List<PassingTime> passing = new List<PassingTime>();
            passing.Add(new PassingTime(50));
            passing.Add(new PassingTime(55));

            ResponseTripDto outputObj = new ResponseTripDto("cantDetermine", "pathId", "lineId", passing);
            List<ResponseTripDto> listOutput = new List<ResponseTripDto>();
            listOutput.Add(outputObj);

            var Tripservice = new Mock<IRegisterTripService>();
            Tripservice.Setup(o => o.AddAsync(It.IsAny<string>(), It.IsAny<RegisterTripsDto>()))
                .Returns(Task.FromResult(listOutput));



            //mocking register vehicleDuty service
            VehicleDutyDto input = new VehicleDutyDto("vehicleDutyt1", "XX-01-XX");
            VehicleDutyDto expResult = input;

            var VDservice = new Mock<IVehicleDutyService>();
            VDservice.Setup(o => o.AddAsync(It.IsAny<VehicleDutyDto>()))
              .Returns(Task.FromResult(input));


            //mocking register driverDuty service
            List<string> wbs = new List<string>();
            wbs.Add("WorkBlock:2");         
            DriverDutyPlannedResponseDto inputdd = new DriverDutyPlannedResponseDto("drivDutyt1", null, wbs);
            var DDservice = new Mock<IDriverDutyService>();
            DDservice.Setup(o => o.AddPlannedDriverDutyAsync(It.IsAny<DriverDutyPlannedDto>()))
               .Returns(Task.FromResult(inputdd));


            //mocking register WorkBlock service
            WorkBlockDto[] wkList = new WorkBlockDto[1];

            string[] trips = new string[1];
            trips[0] = "";

            wkList[0] = new WorkBlockDto("","1234567890", "1234567890", "10/01/2030", "10:30:20", "10/01/2030", "10:30:20", trips);

            WorkBlockGeneratorDto inputWB = new WorkBlockGeneratorDto(1, 1, "20/01/2030", "", new List<string>());
            WorkBlockGeneratedDto expResultWB = new WorkBlockGeneratedDto(wkList);

            var service = new Mock<IWorkBlocksOfVehicleDutyService>();
            service.Setup(o => o.AddAsync(It.IsAny<string>(), It.IsAny<WorkBlockGeneratorDto>()))
              .Returns(Task.FromResult(expResultWB));


            //mocking httpclientFactory


            //Mock the handler
            var mockHttpMessageHandler = new Mock<HttpMessageHandler>();

            //Setup protected method on httpmessagehandler mock
            mockHttpMessageHandler.Protected()
                .SetupSequence<Task<HttpResponseMessage>>("SendAsync",
                    ItExpr.IsAny<HttpRequestMessage>(),
                    ItExpr.IsAny<CancellationToken>()
                )
                .ReturnsAsync(new HttpResponseMessage()
                {
                    StatusCode = HttpStatusCode.OK,
                    Content = new StringContent("{\"key\":\"pathId\",\"line\":\"lineId\",\"type\":\"Go\",\"pathSegments\":[{ \"node1\":\"nodeTest1\", \"node2\":\"nodeTest2\", \"duration\":5, \"distance\":200 }]}")
                })
                .ReturnsAsync(new HttpResponseMessage()
                {
                    StatusCode = HttpStatusCode.OK,
                    Content = new StringContent("{\"key\":\"lineId\", \"paths\":[{\"key\":\"pathId\",\"line\":\"lineId\",\"type\":\"Go\",\"pathSegments\":[{ \"node1\":\"nodeTest1\", \"node2\":\"nodeTest2\", \"duration\":5, \"distance\":200 }]}]}")
                });


            // use real http client with mocked handler here
            var httpClient = new HttpClient(mockHttpMessageHandler.Object)
            {
                BaseAddress = new Uri("http://test.com/"),
            };

            var httpClientFactoryMock = new Mock<IHttpClientFactory>();

            // setup the method call
            httpClientFactoryMock.Setup(x => x.CreateClient(It.IsAny<String>()))
                .Returns(httpClient);

            
            using (var stream = File.OpenRead("../../../../GLXFile/MDV_TestFiles/optTestFile.glx.xml"))
            {
                var file = new FormFile(stream, 0, stream.Length, null, "optTestFile")
                {
                    Headers = new HeaderDictionary(),
                    ContentType = "application/xml"
                };
           
            

            var httpContext = new DefaultHttpContext();
            httpContext.Request.Headers["Authorization"] = "test";

            //Creating Import Service
            ImportGlxService importService = new ImportGlxService(httpClientFactoryMock.Object, Tripservice.Object, VDservice.Object, DDservice.Object, service.Object); ;

            //creating import controller
            // ImportGlxController controller = new ImportGlxController(importService);


            ImportGlxController controller = new ImportGlxController(importService)
            {
                ControllerContext = new ControllerContext()
                {
                    HttpContext = httpContext
                }
            };

            var result = await controller.ImportGlx(file);

              

                Assert.IsType<OkObjectResult>(result);

                OkObjectResult okRes = (OkObjectResult)result;

                var statusCode = okRes.StatusCode;

                Assert.Equal(200, statusCode);

                Assert.Equal(0, ((ImportFileReplyDto)(okRes.Value)).errorList.Count);
                Assert.Equal(0, ((ImportFileReplyDto)(okRes.Value)).numberOfErros);
                Assert.Equal(604, ((ImportFileReplyDto)(okRes.Value)).NumbersOfObjectsImported);
            }

           



        }


        [Fact]
        public async void ShouldImportFileWithSomeErrors_TripsWereNotImported()
        {

            //mocking register trip service
            List<PassingTime> passing = new List<PassingTime>();
            passing.Add(new PassingTime(50));
            passing.Add(new PassingTime(55));

            ResponseTripDto outputObj = new ResponseTripDto("cantDetermine", "pathId", "lineId", passing);
            List<ResponseTripDto> listOutput = new List<ResponseTripDto>();
            listOutput.Add(outputObj);

            var Tripservice = new Mock<IRegisterTripService>();
            Tripservice.Setup(o => o.AddAsync(It.IsAny<string>(), It.IsAny<RegisterTripsDto>()))
                .Throws(new Exception());



            //mocking register vehicleDuty service
            VehicleDutyDto input = new VehicleDutyDto("vehicleDutyt1", "XX-01-XX");
            VehicleDutyDto expResult = input;

            var VDservice = new Mock<IVehicleDutyService>();
            VDservice.Setup(o => o.AddAsync(It.IsAny<VehicleDutyDto>()))
              .Returns(Task.FromResult(input));


            //mocking register driverDuty service
           

            DriverDutyPlannedResponseDto inputdd = new DriverDutyPlannedResponseDto("drivDutyt1", null, null);
            var DDservice = new Mock<IDriverDutyService>();
            DDservice.Setup(o => o.AddPlannedDriverDutyAsync(It.IsAny<DriverDutyPlannedDto>()))
               .Returns(Task.FromResult(inputdd));


            //mocking register WorkBlock service
            WorkBlockDto[] wkList = new WorkBlockDto[1];

            string[] trips = new string[1];
            trips[0] = "";

            wkList[0] = new WorkBlockDto("", "1234567890", "1234567890", "10/01/2030", "10:30:20", "10/01/2030", "10:30:20", trips);

            WorkBlockGeneratorDto inputWB = new WorkBlockGeneratorDto(1, 1, "20/01/2030", "", new List<string>());
            WorkBlockGeneratedDto expResultWB = new WorkBlockGeneratedDto(wkList);

            var service = new Mock<IWorkBlocksOfVehicleDutyService>();
            service.Setup(o => o.AddAsync(It.IsAny<string>(), It.IsAny<WorkBlockGeneratorDto>()))
              .Returns(Task.FromResult(expResultWB));


            //mocking httpclientFactory


            //Mock the handler
            var mockHttpMessageHandler = new Mock<HttpMessageHandler>();

            //Setup protected method on httpmessagehandler mock
            mockHttpMessageHandler.Protected()
                .SetupSequence<Task<HttpResponseMessage>>("SendAsync",
                    ItExpr.IsAny<HttpRequestMessage>(),
                    ItExpr.IsAny<CancellationToken>()
                )
                .ReturnsAsync(new HttpResponseMessage()
                {
                    StatusCode = HttpStatusCode.OK,
                    Content = new StringContent("{\"key\":\"pathId\",\"line\":\"lineId\",\"type\":\"Go\",\"pathSegments\":[{ \"node1\":\"nodeTest1\", \"node2\":\"nodeTest2\", \"duration\":5, \"distance\":200 }]}")
                })
                .ReturnsAsync(new HttpResponseMessage()
                {
                    StatusCode = HttpStatusCode.OK,
                    Content = new StringContent("{\"key\":\"lineId\", \"paths\":[{\"key\":\"pathId\",\"line\":\"lineId\",\"type\":\"Go\",\"pathSegments\":[{ \"node1\":\"nodeTest1\", \"node2\":\"nodeTest2\", \"duration\":5, \"distance\":200 }]}]}")
                });


            // use real http client with mocked handler here
            var httpClient = new HttpClient(mockHttpMessageHandler.Object)
            {
                BaseAddress = new Uri("http://test.com/"),
            };

            var httpClientFactoryMock = new Mock<IHttpClientFactory>();

            // setup the method call
            httpClientFactoryMock.Setup(x => x.CreateClient(It.IsAny<String>()))
                .Returns(httpClient);


            using (var stream = File.OpenRead("../../../../GLXFile/MDV_TestFiles/optTestFile.glx.xml"))
            {
                var file = new FormFile(stream, 0, stream.Length, null, "optTestFile")
                {
                    Headers = new HeaderDictionary(),
                    ContentType = "application/xml"
                };



                var httpContext = new DefaultHttpContext();
                httpContext.Request.Headers["Authorization"] = "test";

                //Creating Import Service
                ImportGlxService importService = new ImportGlxService(httpClientFactoryMock.Object, Tripservice.Object, VDservice.Object, DDservice.Object, service.Object); ;

                //creating import controller
                // ImportGlxController controller = new ImportGlxController(importService);


                ImportGlxController controller = new ImportGlxController(importService)
                {
                    ControllerContext = new ControllerContext()
                    {
                        HttpContext = httpContext
                    }
                };

                var result = await controller.ImportGlx(file);

                //creating the expected result
                List<string> l = new List<string>();
                ImportFileReplyDto exp = new ImportFileReplyDto(l, 605, 325);


                Assert.IsType<OkObjectResult>(result);

                OkObjectResult okRes = (OkObjectResult)result;
                



                Assert.Equal(200, okRes.StatusCode);

                Assert.Equal(326, ((ImportFileReplyDto)(okRes.Value)).errorList.Count);
                Assert.Equal(326, ((ImportFileReplyDto)(okRes.Value)).numberOfErros);
                Assert.Equal(278, ((ImportFileReplyDto)(okRes.Value)).NumbersOfObjectsImported);
          
            }





        }


   

        [Fact]
        public async void ShouldNotImportFile_InvalidFileType()
        {

            //mocking register trip service
            List<PassingTime> passing = new List<PassingTime>();
            passing.Add(new PassingTime(50));
            passing.Add(new PassingTime(55));

            ResponseTripDto outputObj = new ResponseTripDto("cantDetermine", "pathId", "lineId", passing);
            List<ResponseTripDto> listOutput = new List<ResponseTripDto>();
            listOutput.Add(outputObj);

            var Tripservice = new Mock<IRegisterTripService>();
            Tripservice.Setup(o => o.AddAsync(It.IsAny<string>(), It.IsAny<RegisterTripsDto>()))
                .Returns(Task.FromResult(listOutput));



            //mocking register vehicleDuty service
            VehicleDutyDto input = new VehicleDutyDto("vehicleDutyt1", "XX-01-XX");
            VehicleDutyDto expResult = input;

            var VDservice = new Mock<IVehicleDutyService>();
            VDservice.Setup(o => o.AddAsync(It.IsAny<VehicleDutyDto>()))
              .Returns(Task.FromResult(input));


            //mocking register driverDuty service
            DriverDutyPlannedResponseDto inputdd = new DriverDutyPlannedResponseDto("drivDutyt1", null, null);
            var DDservice = new Mock<IDriverDutyService>();
            DDservice.Setup(o => o.AddPlannedDriverDutyAsync(It.IsAny<DriverDutyPlannedDto>()))
               .Returns(Task.FromResult(inputdd));


            //mocking register WorkBlock service
            WorkBlockDto[] wkList = new WorkBlockDto[1];

            string[] trips = new string[1];
            trips[0] = "";

            wkList[0] = new WorkBlockDto("", "1234567890", "1234567890", "10/01/2030", "10:30:20", "10/01/2030", "10:30:20", trips);

            WorkBlockGeneratorDto inputWB = new WorkBlockGeneratorDto(1, 1, "20/01/2030", "", new List<string>());
            WorkBlockGeneratedDto expResultWB = new WorkBlockGeneratedDto(wkList);

            var service = new Mock<IWorkBlocksOfVehicleDutyService>();
            service.Setup(o => o.AddAsync(It.IsAny<string>(), It.IsAny<WorkBlockGeneratorDto>()))
              .Returns(Task.FromResult(expResultWB));


            //mocking httpclientFactory


            //Mock the handler
            var mockHttpMessageHandler = new Mock<HttpMessageHandler>();

            //Setup protected method on httpmessagehandler mock
            mockHttpMessageHandler.Protected()
                .SetupSequence<Task<HttpResponseMessage>>("SendAsync",
                    ItExpr.IsAny<HttpRequestMessage>(),
                    ItExpr.IsAny<CancellationToken>()
                )
                .ReturnsAsync(new HttpResponseMessage()
                {
                    StatusCode = HttpStatusCode.OK,
                    Content = new StringContent("{\"key\":\"pathId\",\"line\":\"lineId\",\"type\":\"Go\",\"pathSegments\":[{ \"node1\":\"nodeTest1\", \"node2\":\"nodeTest2\", \"duration\":5, \"distance\":200 }]}")
                })
                .ReturnsAsync(new HttpResponseMessage()
                {
                    StatusCode = HttpStatusCode.OK,
                    Content = new StringContent("{\"key\":\"lineId\", \"paths\":[{\"key\":\"pathId\",\"line\":\"lineId\",\"type\":\"Go\",\"pathSegments\":[{ \"node1\":\"nodeTest1\", \"node2\":\"nodeTest2\", \"duration\":5, \"distance\":200 }]}]}")
                });


            // use real http client with mocked handler here
            var httpClient = new HttpClient(mockHttpMessageHandler.Object)
            {
                BaseAddress = new Uri("http://test.com/"),
            };

            var httpClientFactoryMock = new Mock<IHttpClientFactory>();

            // setup the method call
            httpClientFactoryMock.Setup(x => x.CreateClient(It.IsAny<String>()))
                .Returns(httpClient);

            using (var stream = File.OpenRead("../../../../GLXFile/MDV_TestFiles/InvalidFileType.png"))
           
            {
                var file = new FormFile(stream, 0, stream.Length, null, "optTestFile")
                {
                    Headers = new HeaderDictionary(),
                    ContentType = "application/xml"
                };



                var httpContext = new DefaultHttpContext();
                httpContext.Request.Headers["Authorization"] = "test";

                //Creating Import Service
                ImportGlxService importService = new ImportGlxService(httpClientFactoryMock.Object, Tripservice.Object, VDservice.Object, DDservice.Object, service.Object); ;

                //creating import controller
                // ImportGlxController controller = new ImportGlxController(importService);


                ImportGlxController controller = new ImportGlxController(importService)
                {
                    ControllerContext = new ControllerContext()
                    {
                        HttpContext = httpContext
                    }
                };

                var result = await controller.ImportGlx(file);



                Assert.IsType<BadRequestObjectResult>(result);

                BadRequestObjectResult okRes = (BadRequestObjectResult)result;

                var statusCode = okRes.StatusCode;

                Assert.Equal(400, statusCode);
                Assert.Equal(0, ((ImportFileReplyDto)(okRes.Value)).errorList.Count);
                Assert.Equal(0, ((ImportFileReplyDto)(okRes.Value)).numberOfErros);
                Assert.Equal(0, ((ImportFileReplyDto)(okRes.Value)).NumbersOfObjectsImported);


            }





        }

    }
}
