using DDDNetCore.DriverDuties.Dto;
using DDDNetCore.DriverDuties.Services;
using DDDNetCore.ImportFile.Services;
using DDDNetCore.Trips.Domain.ValueObjects;
using DDDNetCore.Trips.DTO;
using DDDNetCore.Trips.Services;
using DDDNetCore.VehicleDuties.Dto;
using DDDNetCore.VehicleDuties.Services;
using DDDNetCore.WorkBlocks.Dto;
using DDDNetCore.WorkBlocks.Services;
using Moq;
using Moq.Protected;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Xunit;

namespace XUnitTestMDV.ImportFileTest.UnitTests.Services
{
    public class ImportFileServiceTest
    {


        [Fact]
        public async Task TestFile1_ShouldImportEverythingAsync()
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

            ImportGlxService importService = new ImportGlxService(httpClientFactoryMock.Object, Tripservice.Object, VDservice.Object, DDservice.Object, service.Object); ;
           var dto = await importService.ImportGlx("../../../../GLXFile/MDV_TestFiles/optTestFile.glx.xml", null);
            

                //Asserts

                Assert.Empty(dto.errorList);
            Assert.Equal(0,dto.numberOfErros);
            Assert.Equal(605,dto.NumbersOfLinesPresentInFile);
            Assert.Equal(604, dto.NumbersOfObjectsImported);

        }



        [Fact]
        public async Task TestFile1_ShouldNotImportTrips()
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

            ImportGlxService importService = new ImportGlxService(httpClientFactoryMock.Object, Tripservice.Object, VDservice.Object, DDservice.Object, service.Object); ;
           var dto = await importService.ImportGlx("../../../../GLXFile/MDV_TestFiles/optTestFile.glx.xml", null);


            //Asserts

            Assert.Equal(326, dto.errorList.Count); // there was 326 lines not imported so it generated an error
            Assert.Equal(326, dto.numberOfErros);
            Assert.Equal(605, dto.NumbersOfLinesPresentInFile);
            Assert.Equal(604-326, dto.NumbersOfObjectsImported);

        }


        [Fact]
        public async Task TestFile1_ShouldNotImportTripsAndVehicleDuties()
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
              .Throws(new Exception());


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

            ImportGlxService importService = new ImportGlxService(httpClientFactoryMock.Object, Tripservice.Object, VDservice.Object, DDservice.Object, service.Object); ;
            var dto = await importService.ImportGlx("../../../../GLXFile/MDV_TestFiles/optTestFile.glx.xml", null);


            //Asserts

            Assert.Equal(341, dto.errorList.Count); // there was 326 lines not imported so it generated an error
            Assert.Equal(341, dto.numberOfErros);
            Assert.Equal(605, dto.NumbersOfLinesPresentInFile);
            Assert.Equal(604 - 341, dto.NumbersOfObjectsImported);

        }



        [Fact]
        public async Task TestFile1_ShouldNotImportTrips_VehicleDuties_DriverDuties()
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
              .Throws(new Exception());


            //mocking register driverDuty service
            

            var DDservice = new Mock<IDriverDutyService>();
            DDservice.Setup(o => o.AddPlannedDriverDutyAsync(It.IsAny<DriverDutyPlannedDto>()))
               .Throws(new Exception());


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

            ImportGlxService importService = new ImportGlxService(httpClientFactoryMock.Object, Tripservice.Object, VDservice.Object, DDservice.Object, service.Object); ;
            var dto = await importService.ImportGlx("../../../../GLXFile/MDV_TestFiles/optTestFile.glx.xml", null);


            //Asserts

            Assert.Equal(370, dto.errorList.Count); // there was 326 lines not imported so it generated an error
            Assert.Equal(370, dto.numberOfErros);
            Assert.Equal(605, dto.NumbersOfLinesPresentInFile);
            Assert.Equal(604 - 370, dto.NumbersOfObjectsImported);

        }


        [Fact]
        public async Task TestFile1_ShouldNotImportTrips_VehicleDuties_DriverDuties_WorkBlocks()
            
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
              .Throws(new Exception());


            //mocking register driverDuty service
            

            var DDservice = new Mock<IDriverDutyService>();
            DDservice.Setup(o => o.AddPlannedDriverDutyAsync(It.IsAny<DriverDutyPlannedDto>()))
               .Throws(new Exception());


            //mocking register WorkBlock service
            WorkBlockDto[] wkList = new WorkBlockDto[1];

            string[] trips = new string[1];
            trips[0] = "";

            wkList[0] = new WorkBlockDto("", "1234567890", "1234567890", "10/01/2030", "10:30:20", "10/01/2030", "10:30:20", trips);

            WorkBlockGeneratorDto inputWB = new WorkBlockGeneratorDto(1, 1, "20/01/2030", "", new List<string>());
            WorkBlockGeneratedDto expResultWB = new WorkBlockGeneratedDto(wkList);

            var service = new Mock<IWorkBlocksOfVehicleDutyService>();
            service.Setup(o => o.AddAsync(It.IsAny<string>(), It.IsAny<WorkBlockGeneratorDto>()))
              .Throws(new Exception());


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

            ImportGlxService importService = new ImportGlxService(httpClientFactoryMock.Object, Tripservice.Object, VDservice.Object, DDservice.Object, service.Object); ;
            var dto = await importService.ImportGlx("../../../../GLXFile/MDV_TestFiles/optTestFile.glx.xml", null);


            //Asserts

            Assert.Equal(605, dto.errorList.Count); // there was 326 lines not imported so it generated an error
            Assert.Equal(605, dto.numberOfErros);
            Assert.Equal(605, dto.NumbersOfLinesPresentInFile);
            Assert.True(dto.NumbersOfObjectsImported<=0);

        }


    }
}
