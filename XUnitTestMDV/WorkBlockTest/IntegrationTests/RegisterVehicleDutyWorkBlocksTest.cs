using DDDNetCore.Lines.Dto;
using DDDNetCore.Lines.Mappers;
using DDDNetCore.Trips.Domain;
using DDDNetCore.Trips.Domain.ValueObjects;
using DDDNetCore.Trips.Repository;
using DDDNetCore.VehicleDuties.Domain;
using DDDNetCore.VehicleDuties.Domain.ValueObjects;
using DDDNetCore.VehicleDuties.Repository;
using DDDNetCore.Vehicles.Domain;
using DDDNetCore.Vehicles.Repository;
using DDDNetCore.Vehicles.ValueObjects;
using DDDNetCore.WorkBlocks.Controllers;
using DDDNetCore.WorkBlocks.Domain;
using DDDNetCore.WorkBlocks.Dto;
using DDDNetCore.WorkBlocks.Mappers;
using DDDNetCore.WorkBlocks.Repository;
using DDDNetCore.WorkBlocks.Services;
using DDDSample1.Domain.Shared;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Moq.Protected;
using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using Xunit;

namespace XUnitTestMDV.WorkBlockTest.IntegrationTests
{
    public class RegisterVehicleDutyWorkBlocksTest
    {

        [Fact]
        public async void ShouldRegisterWorkBlocks_NormalSituation1Async()
        {
            //Declare input and expected result
            List<string> inputTrips = new List<string>();
            inputTrips.Add("trip1");
            inputTrips.Add("trip2");

            uint numberOfBlocksInput = 2;
            uint numberOfSecondsInput = 3600; //1 hour
            string dayTimeInput = "1/1/2030 08:30:00";
            string veicDutyCodeInput = "0123456789";

            WorkBlockGeneratorDto input = new WorkBlockGeneratorDto(numberOfBlocksInput, numberOfSecondsInput, dayTimeInput, veicDutyCodeInput, inputTrips);

            WorkBlockDto[] expResultWorkBlockList = new WorkBlockDto[2];
            expResultWorkBlockList[0] = new WorkBlockDto("",null, veicDutyCodeInput, "1/1/2030", "08:30:00", "1/1/2030", "09:30:00", new string[] { "trip1" });
            expResultWorkBlockList[1] = new WorkBlockDto("", null, veicDutyCodeInput, "1/1/2030", "09:30:00", "1/1/2030", "10:30:00", new string[] { "trip1", "trip2" });

            WorkBlockGeneratedDto expResult = new WorkBlockGeneratedDto(expResultWorkBlockList);

            //Declare intermediate operation results
            LineDto lineOfTripDto = new LineDto();
            lineOfTripDto.AllowedVehicles = new List<string>();

            Vehicle veic = new Vehicle("09-09-AA", "00000000000000000", "testType", "12/12/2000");
            VehicleDuty veicDutyOfDto = new VehicleDuty(veicDutyCodeInput, "09-09-AA");

            List<Trip> tripsOfDtoList = new List<Trip>();
            tripsOfDtoList.Add(new Trip("a", "a", new List<int>() { 32400, 36000 }));    //From 9:00h to 10:00h  -> overlaps with workblock 0 and 1
            tripsOfDtoList.Add(new Trip("a", "a", new List<int>() { 36000, 39600 }));   //From 10:00h to 11:00h -> overlaps with workblock 1

            List<WorkBlock> workBlocksOfVeicDutyList = new List<WorkBlock>();   //Empty cause no workblocks have been created for the vehicle duty yet

            //Mock Dependencies
            var unitOfWork = new Mock<IUnitOfWork>();
            unitOfWork.Setup(o => o.CommitAsync())
                .Returns(Task.FromResult(200));

            // Mock the handler
            var mockHttpMessageHandler = new Mock<HttpMessageHandler>();

            string dataFromLineRequest = "[{\"key\":\"a\",\"name\":\"a\",\"terminalNode1\":\"WorkBlockTestNode01\",\"terminalNode2\":\"WorkBlockTestNode02\",\"RGB\":{\"red\":0,\"green\":0,\"blue\":0},\"AllowedVehicles\":[],\"AllowedDrivers\":[]}]";

            // Setup Protected method on HttpMessageHandler mock.
            mockHttpMessageHandler.Protected()
                .Setup<Task<HttpResponseMessage>>(
                    "SendAsync",
                    ItExpr.IsAny<HttpRequestMessage>(),
                    ItExpr.IsAny<CancellationToken>()
                ).ReturnsAsync(new HttpResponseMessage()
                {
                    StatusCode = HttpStatusCode.OK,
                    Content = new StringContent(dataFromLineRequest)
                }) ;

            // use real http client with mocked handler here
            var httpClient = new HttpClient(mockHttpMessageHandler.Object)
            {
                BaseAddress = new Uri("http://test.com/"),
            };

            var clientFactory = new Mock<IHttpClientFactory>();

            // setup the method call
            clientFactory.Setup(x => x.CreateClient(It.IsAny<String>()))
                .Returns(httpClient);

            var lineMapper = new LineMapper();

            var workBlockMapper = new WorkBlockMapper();

            var vehicleRepository = new Mock<IVehicleRepository>();
            vehicleRepository.Setup(o => o.GetByIdAsync(It.IsAny<VehicleLicense>()))
                .Returns(Task.FromResult(veic));

            var vehicleDutyRepository = new Mock<IVehicleDutyRepository>();
            vehicleDutyRepository.Setup(o => o.GetByIdAsync(It.IsAny<VehicleDutyCode>()))
                .Returns(Task.FromResult(veicDutyOfDto));

            var tripRepository = new Mock<ITripRepository>();
            tripRepository.Setup(o => o.GetByIdsAsync(It.IsAny<List<TripKey>>()))
                .Returns(Task.FromResult(tripsOfDtoList));

            var workBlockRepository = new Mock<IWorkBlockRepository>();
            workBlockRepository.Setup(o => o.GetAllByVehicleDutyAsync(It.IsAny<VehicleDutyCode>()))
                .Returns(Task.FromResult(workBlocksOfVeicDutyList));

            //Run the service
            var serv = new WorkBlocksOfVehicleDutyService(unitOfWork.Object, clientFactory.Object, vehicleRepository.Object,
                vehicleDutyRepository.Object, tripRepository.Object, workBlockRepository.Object, lineMapper, workBlockMapper);

            var httpContext = new DefaultHttpContext();
            httpContext.Request.Headers["Authorization"] = "Bearer 215418152";

            var contr = new RegisterVehicleDutyWorkBlocksController(serv)
            {
                ControllerContext = new ControllerContext()
                {
                    HttpContext = httpContext
                }
            };

            ActionResult<WorkBlockGeneratedDto> result = await contr.Register(input);

            //Check if results are correct

            //Checks if the action was completed successfully
            Assert.IsType<OkObjectResult>(result.Result);

            OkObjectResult okRes = (OkObjectResult)result.Result;
            WorkBlockGeneratedDto okFinal = (WorkBlockGeneratedDto)okRes.Value;

            //Chcks if the value of the task is correct
            Assert.Equal(expResult.Wks.Length, okFinal.Wks.Length);

            for(int i=0; i < expResult.Wks.Length; i++)
            {
                Assert.Equal(expResult.Wks[i].DriverDutyCode, okFinal.Wks[i].DriverDutyCode);
                Assert.Equal(expResult.Wks[i].EndDate, okFinal.Wks[i].EndDate);
                Assert.Equal(expResult.Wks[i].StartDate, okFinal.Wks[i].StartDate);
                Assert.Equal(expResult.Wks[i].EndTime, okFinal.Wks[i].EndTime);
                Assert.Equal(expResult.Wks[i].StartTime, okFinal.Wks[i].StartTime);
                Assert.Equal(expResult.Wks[i].VehicleDutyCode, okFinal.Wks[i].VehicleDutyCode);
                Assert.Equal(expResult.Wks[i].trips.Length, okFinal.Wks[i].trips.Length);
            }
            

        }

        [Fact]
        public async void ShouldRegisterWorkBlocks_NormalSituation2_CanOnlyCreateAFewBetweenAlreadyCreatedWorkBlocks()
        {
            //Declare input and expected result
            List<string> inputTrips = new List<string>();
            inputTrips.Add("trip1");
            inputTrips.Add("trip2");

            uint numberOfBlocksInput = 4;
            uint numberOfSecondsInput = 3600; //1 hour
            string dayTimeInput = "1/1/2030 08:30:00";
            string veicDutyCodeInput = "0123456789";

            WorkBlockGeneratorDto input = new WorkBlockGeneratorDto(numberOfBlocksInput, numberOfSecondsInput, dayTimeInput, veicDutyCodeInput, inputTrips);

            WorkBlockDto[] expResultWorkBlockList = new WorkBlockDto[2];
            expResultWorkBlockList[0] = new WorkBlockDto("", null, veicDutyCodeInput, "1/1/2030", "08:30:00", "1/1/2030", "09:30:00", new string[] { "trip1" });
            expResultWorkBlockList[1] = new WorkBlockDto("", null, veicDutyCodeInput, "1/1/2030", "09:30:00", "1/1/2030", "10:30:00", new string[] { "trip1", "trip2" });

            WorkBlockGeneratedDto expResult = new WorkBlockGeneratedDto(expResultWorkBlockList);

            //Declare intermediate operation results
            LineDto lineOfTripDto = new LineDto();
            lineOfTripDto.AllowedVehicles = new List<string>();

            Vehicle veic = new Vehicle("09-09-AA", "00000000000000000", "testType", "12/12/2000");
            VehicleDuty veicDutyOfDto = new VehicleDuty(veicDutyCodeInput, "09-09-AA");

            List<Trip> tripsOfDtoList = new List<Trip>();
            tripsOfDtoList.Add(new Trip("a", "a", new List<int>() { 32400, 36000 }));    //From 9:00h to 10:00h  -> overlaps with workblock 0 and 1
            tripsOfDtoList.Add(new Trip("a", "a", new List<int>() { 36000, 39600 }));   //From 10:00h to 11:00h -> overlaps with workblock 1

            //THIS PART MATTERS FOR THIS TEST
            List<WorkBlock> workBlocksOfVeicDutyList = new List<WorkBlock>();
            //                                           year/month/day/hour/min/sec
            workBlocksOfVeicDutyList.Add(new WorkBlock(new DateTime(2030,1,1,7,30,0), new DateTime(2030, 1, 1, 8, 30, 0),null,veicDutyCodeInput,new List<Trip>()));
            workBlocksOfVeicDutyList.Add(new WorkBlock(new DateTime(2030, 1, 1, 10, 30, 0), new DateTime(2030, 1, 1, 11, 30, 0), null, veicDutyCodeInput, new List<Trip>()));

            ///////////////

            //Mock Dependencies
            var unitOfWork = new Mock<IUnitOfWork>();
            unitOfWork.Setup(o => o.CommitAsync())
                .Returns(Task.FromResult(200));

            // Mock the handler
            var mockHttpMessageHandler = new Mock<HttpMessageHandler>();

            string dataFromLineRequest = "[{\"key\":\"a\",\"name\":\"a\",\"terminalNode1\":\"WorkBlockTestNode01\",\"terminalNode2\":\"WorkBlockTestNode02\",\"RGB\":{\"red\":0,\"green\":0,\"blue\":0},\"AllowedVehicles\":[],\"AllowedDrivers\":[]}]";

            // Setup Protected method on HttpMessageHandler mock.
            mockHttpMessageHandler.Protected()
                .Setup<Task<HttpResponseMessage>>(
                    "SendAsync",
                    ItExpr.IsAny<HttpRequestMessage>(),
                    ItExpr.IsAny<CancellationToken>()
                ).ReturnsAsync(new HttpResponseMessage()
                {
                    StatusCode = HttpStatusCode.OK,
                    Content = new StringContent(dataFromLineRequest)
                });

            // use real http client with mocked handler here
            var httpClient = new HttpClient(mockHttpMessageHandler.Object)
            {
                BaseAddress = new Uri("http://test.com/"),
            };

            var clientFactory = new Mock<IHttpClientFactory>();

            // setup the method call
            clientFactory.Setup(x => x.CreateClient(It.IsAny<String>()))
                .Returns(httpClient);

            var lineMapper = new LineMapper();

            var workBlockMapper = new WorkBlockMapper();

            var vehicleRepository = new Mock<IVehicleRepository>();
            vehicleRepository.Setup(o => o.GetByIdAsync(It.IsAny<VehicleLicense>()))
                .Returns(Task.FromResult(veic));

            var vehicleDutyRepository = new Mock<IVehicleDutyRepository>();
            vehicleDutyRepository.Setup(o => o.GetByIdAsync(It.IsAny<VehicleDutyCode>()))
                .Returns(Task.FromResult(veicDutyOfDto));

            var tripRepository = new Mock<ITripRepository>();
            tripRepository.Setup(o => o.GetByIdsAsync(It.IsAny<List<TripKey>>()))
                .Returns(Task.FromResult(tripsOfDtoList));

            var workBlockRepository = new Mock<IWorkBlockRepository>();
            workBlockRepository.Setup(o => o.GetAllByVehicleDutyAsync(It.IsAny<VehicleDutyCode>()))
                .Returns(Task.FromResult(workBlocksOfVeicDutyList));

            //Run the service
            var serv = new WorkBlocksOfVehicleDutyService(unitOfWork.Object, clientFactory.Object, vehicleRepository.Object,
                vehicleDutyRepository.Object, tripRepository.Object, workBlockRepository.Object, lineMapper, workBlockMapper);

            var httpContext = new DefaultHttpContext();
            httpContext.Request.Headers["Authorization"] = "Bearer 215418152";

            var contr = new RegisterVehicleDutyWorkBlocksController(serv)
            {
                ControllerContext = new ControllerContext()
                {
                    HttpContext = httpContext
                }
            };

            ActionResult<WorkBlockGeneratedDto> result = await contr.Register(input);

            //Check if results are correct

            //Checks if the action was completed successfully
            Assert.IsType<OkObjectResult>(result.Result);

            OkObjectResult okRes = (OkObjectResult)result.Result;
            WorkBlockGeneratedDto okFinal = (WorkBlockGeneratedDto)okRes.Value;

            //Chcks if the value of the task is correct
            Assert.Equal(expResult.Wks.Length, okFinal.Wks.Length);

            for (int i = 0; i < expResult.Wks.Length; i++)
            {
                Assert.Equal(expResult.Wks[i].DriverDutyCode, okFinal.Wks[i].DriverDutyCode);
                Assert.Equal(expResult.Wks[i].EndDate, okFinal.Wks[i].EndDate);
                Assert.Equal(expResult.Wks[i].StartDate, okFinal.Wks[i].StartDate);
                Assert.Equal(expResult.Wks[i].EndTime, okFinal.Wks[i].EndTime);
                Assert.Equal(expResult.Wks[i].StartTime, okFinal.Wks[i].StartTime);
                Assert.Equal(expResult.Wks[i].VehicleDutyCode, okFinal.Wks[i].VehicleDutyCode);
                Assert.Equal(expResult.Wks[i].trips.Length, okFinal.Wks[i].trips.Length);
            }


        }

        [Fact]
        public async void ShouldRegisterWorkBlocks_ExceptionOcurred_TriesToCreateInsideAlreadyExistingWorkBlock()
        {
            //Declare input and expected result
            List<string> inputTrips = new List<string>();
            inputTrips.Add("trip1");
            inputTrips.Add("trip2");

            uint numberOfBlocksInput = 4;
            uint numberOfSecondsInput = 3600; //1 hour
            string dayTimeInput = "1/1/2030 08:30:00";
            string veicDutyCodeInput = "0123456789";

            WorkBlockGeneratorDto input = new WorkBlockGeneratorDto(numberOfBlocksInput, numberOfSecondsInput, dayTimeInput, veicDutyCodeInput, inputTrips);

            WorkBlockDto[] expResultWorkBlockList = new WorkBlockDto[2];
            expResultWorkBlockList[0] = new WorkBlockDto("", null, veicDutyCodeInput, "1/1/2030", "08:30:00", "1/1/2030", "09:30:00", new string[] { "trip1" });
            expResultWorkBlockList[1] = new WorkBlockDto("", null, veicDutyCodeInput, "1/1/2030", "09:30:00", "1/1/2030", "10:30:00", new string[] { "trip1", "trip2" });

            WorkBlockGeneratedDto expResult = new WorkBlockGeneratedDto(expResultWorkBlockList);

            //Declare intermediate operation results
            LineDto lineOfTripDto = new LineDto();
            lineOfTripDto.AllowedVehicles = new List<string>();

            Vehicle veic = new Vehicle("09-09-AA", "00000000000000000", "testType", "12/12/2000");
            VehicleDuty veicDutyOfDto = new VehicleDuty(veicDutyCodeInput, "09-09-AA");

            List<Trip> tripsOfDtoList = new List<Trip>();
            tripsOfDtoList.Add(new Trip("a", "a", new List<int>() { 32400, 36000 }));    //From 9:00h to 10:00h  -> overlaps with workblock 0 and 1
            tripsOfDtoList.Add(new Trip("a", "a", new List<int>() { 36000, 39600 }));   //From 10:00h to 11:00h -> overlaps with workblock 1

            //THIS PART MATTERS FOR THIS TEST
            List<WorkBlock> workBlocksOfVeicDutyList = new List<WorkBlock>();
            //                                           year/month/day/hour/min/sec
            workBlocksOfVeicDutyList.Add(new WorkBlock(new DateTime(2030, 1, 1, 8, 30, 0), new DateTime(2030, 1, 1, 10, 30, 0), null, veicDutyCodeInput, new List<Trip>()));

            ///////////////

            //Mock Dependencies
            var unitOfWork = new Mock<IUnitOfWork>();
            unitOfWork.Setup(o => o.CommitAsync())
                .Returns(Task.FromResult(200));

            // Mock the handler
            var mockHttpMessageHandler = new Mock<HttpMessageHandler>();

            string dataFromLineRequest = "[{\"key\":\"a\",\"name\":\"a\",\"terminalNode1\":\"WorkBlockTestNode01\",\"terminalNode2\":\"WorkBlockTestNode02\",\"RGB\":{\"red\":0,\"green\":0,\"blue\":0},\"AllowedVehicles\":[],\"AllowedDrivers\":[]}]";

            // Setup Protected method on HttpMessageHandler mock.
            mockHttpMessageHandler.Protected()
                .Setup<Task<HttpResponseMessage>>(
                    "SendAsync",
                    ItExpr.IsAny<HttpRequestMessage>(),
                    ItExpr.IsAny<CancellationToken>()
                ).ReturnsAsync(new HttpResponseMessage()
                {
                    StatusCode = HttpStatusCode.OK,
                    Content = new StringContent(dataFromLineRequest)
                });

            // use real http client with mocked handler here
            var httpClient = new HttpClient(mockHttpMessageHandler.Object)
            {
                BaseAddress = new Uri("http://test.com/"),
            };

            var clientFactory = new Mock<IHttpClientFactory>();

            // setup the method call
            clientFactory.Setup(x => x.CreateClient(It.IsAny<String>()))
                .Returns(httpClient);

            var lineMapper = new LineMapper();

            var workBlockMapper = new WorkBlockMapper();

            var vehicleRepository = new Mock<IVehicleRepository>();
            vehicleRepository.Setup(o => o.GetByIdAsync(It.IsAny<VehicleLicense>()))
                .Returns(Task.FromResult(veic));

            var vehicleDutyRepository = new Mock<IVehicleDutyRepository>();
            vehicleDutyRepository.Setup(o => o.GetByIdAsync(It.IsAny<VehicleDutyCode>()))
                .Returns(Task.FromResult(veicDutyOfDto));

            var tripRepository = new Mock<ITripRepository>();
            tripRepository.Setup(o => o.GetByIdsAsync(It.IsAny<List<TripKey>>()))
                .Returns(Task.FromResult(tripsOfDtoList));

            var workBlockRepository = new Mock<IWorkBlockRepository>();
            workBlockRepository.Setup(o => o.GetAllByVehicleDutyAsync(It.IsAny<VehicleDutyCode>()))
                .Returns(Task.FromResult(workBlocksOfVeicDutyList));

            //Run the service
            var serv = new WorkBlocksOfVehicleDutyService(unitOfWork.Object, clientFactory.Object, vehicleRepository.Object,
                vehicleDutyRepository.Object, tripRepository.Object, workBlockRepository.Object, lineMapper, workBlockMapper);

            var httpContext = new DefaultHttpContext();
            httpContext.Request.Headers["Authorization"] = "Bearer 215418152";

            var contr = new RegisterVehicleDutyWorkBlocksController(serv)
            {
                ControllerContext = new ControllerContext()
                {
                    HttpContext = httpContext
                }
            };

            //Check if results are correct

            ActionResult<WorkBlockGeneratedDto> result = await contr.Register(input);

            Assert.IsType<ContentResult>(result.Result);

            ContentResult res = (ContentResult)result.Result;

            //Chcks if the value of the task is correct
            Assert.Equal("No space to create any WorkBlock with the specified duration.", res.Content);
            Assert.Equal("Json", res.ContentType);
            Assert.Equal(400, res.StatusCode);
        }

        [Fact]
        public async void ShouldRegisterWorkBlocks_ExceptionOcurred_SmallerWorkBlockExistsInBetweenToBeCreatedWorkBlock()
        {
            //Declare input and expected result
            List<string> inputTrips = new List<string>();
            inputTrips.Add("trip1");
            inputTrips.Add("trip2");

            uint numberOfBlocksInput = 4;
            uint numberOfSecondsInput = 3600; //1 hour
            string dayTimeInput = "1/1/2030 08:30:00";
            string veicDutyCodeInput = "0123456789";

            WorkBlockGeneratorDto input = new WorkBlockGeneratorDto(numberOfBlocksInput, numberOfSecondsInput, dayTimeInput, veicDutyCodeInput, inputTrips);

            WorkBlockDto[] expResultWorkBlockList = new WorkBlockDto[2];
            expResultWorkBlockList[0] = new WorkBlockDto("", null, veicDutyCodeInput, "1/1/2030", "08:30:00", "1/1/2030", "09:30:00", new string[] { "trip1" });
            expResultWorkBlockList[1] = new WorkBlockDto("", null, veicDutyCodeInput, "1/1/2030", "09:30:00", "1/1/2030", "10:30:00", new string[] { "trip1", "trip2" });

            WorkBlockGeneratedDto expResult = new WorkBlockGeneratedDto(expResultWorkBlockList);

            //Declare intermediate operation results
            LineDto lineOfTripDto = new LineDto();
            lineOfTripDto.AllowedVehicles = new List<string>();

            Vehicle veic = new Vehicle("09-09-AA", "00000000000000000", "testType", "12/12/2000");
            VehicleDuty veicDutyOfDto = new VehicleDuty(veicDutyCodeInput, "09-09-AA");

            List<Trip> tripsOfDtoList = new List<Trip>();
            tripsOfDtoList.Add(new Trip("a", "a", new List<int>() { 32400, 36000 }));    //From 9:00h to 10:00h  -> overlaps with workblock 0 and 1
            tripsOfDtoList.Add(new Trip("a", "a", new List<int>() { 36000, 39600 }));   //From 10:00h to 11:00h -> overlaps with workblock 1

            //THIS PART MATTERS FOR THIS TEST
            List<WorkBlock> workBlocksOfVeicDutyList = new List<WorkBlock>();
            //                                           year/month/day/hour/min/sec
            workBlocksOfVeicDutyList.Add(new WorkBlock(new DateTime(2030, 1, 1, 8, 45, 0), new DateTime(2030, 1, 1, 9, 0, 0), null, veicDutyCodeInput, new List<Trip>()));

            ///////////////

            //Mock Dependencies
            var unitOfWork = new Mock<IUnitOfWork>();
            unitOfWork.Setup(o => o.CommitAsync())
                .Returns(Task.FromResult(200));

            // Mock the handler
            var mockHttpMessageHandler = new Mock<HttpMessageHandler>();

            string dataFromLineRequest = "[{\"key\":\"a\",\"name\":\"a\",\"terminalNode1\":\"WorkBlockTestNode01\",\"terminalNode2\":\"WorkBlockTestNode02\",\"RGB\":{\"red\":0,\"green\":0,\"blue\":0},\"AllowedVehicles\":[],\"AllowedDrivers\":[]}]";

            // Setup Protected method on HttpMessageHandler mock.
            mockHttpMessageHandler.Protected()
                .Setup<Task<HttpResponseMessage>>(
                    "SendAsync",
                    ItExpr.IsAny<HttpRequestMessage>(),
                    ItExpr.IsAny<CancellationToken>()
                ).ReturnsAsync(new HttpResponseMessage()
                {
                    StatusCode = HttpStatusCode.OK,
                    Content = new StringContent(dataFromLineRequest)
                });

            // use real http client with mocked handler here
            var httpClient = new HttpClient(mockHttpMessageHandler.Object)
            {
                BaseAddress = new Uri("http://test.com/"),
            };

            var clientFactory = new Mock<IHttpClientFactory>();

            // setup the method call
            clientFactory.Setup(x => x.CreateClient(It.IsAny<String>()))
                .Returns(httpClient);

            var lineMapper = new LineMapper();

            var workBlockMapper = new WorkBlockMapper();

            var vehicleRepository = new Mock<IVehicleRepository>();
            vehicleRepository.Setup(o => o.GetByIdAsync(It.IsAny<VehicleLicense>()))
                .Returns(Task.FromResult(veic));

            var vehicleDutyRepository = new Mock<IVehicleDutyRepository>();
            vehicleDutyRepository.Setup(o => o.GetByIdAsync(It.IsAny<VehicleDutyCode>()))
                .Returns(Task.FromResult(veicDutyOfDto));

            var tripRepository = new Mock<ITripRepository>();
            tripRepository.Setup(o => o.GetByIdsAsync(It.IsAny<List<TripKey>>()))
                .Returns(Task.FromResult(tripsOfDtoList));

            var workBlockRepository = new Mock<IWorkBlockRepository>();
            workBlockRepository.Setup(o => o.GetAllByVehicleDutyAsync(It.IsAny<VehicleDutyCode>()))
                .Returns(Task.FromResult(workBlocksOfVeicDutyList));

            //Run the service
            var serv = new WorkBlocksOfVehicleDutyService(unitOfWork.Object, clientFactory.Object, vehicleRepository.Object,
                vehicleDutyRepository.Object, tripRepository.Object, workBlockRepository.Object, lineMapper, workBlockMapper);

            var httpContext = new DefaultHttpContext();
            httpContext.Request.Headers["Authorization"] = "Bearer 215418152";

            var contr = new RegisterVehicleDutyWorkBlocksController(serv)
            {
                ControllerContext = new ControllerContext()
                {
                    HttpContext = httpContext
                }
            };

            //Check if results are correct

            ActionResult<WorkBlockGeneratedDto> result = await contr.Register(input);

            Assert.IsType<ContentResult>(result.Result);

            ContentResult res = (ContentResult)result.Result;

            //Chcks if the value of the task is correct
            Assert.Equal("No space to create any WorkBlock with the specified duration.", res.Content);
            Assert.Equal("Json", res.ContentType);
            Assert.Equal(400, res.StatusCode);
        }

        [Fact]
        public async void ShouldRegisterWorkBlocks_ExceptionOcurred_VehicleDutyDoesNotExist_1()
        {
            //Declare input and expected result
            List<string> inputTrips = new List<string>();
            inputTrips.Add("trip1");
            inputTrips.Add("trip2");

            uint numberOfBlocksInput = 2;
            uint numberOfSecondsInput = 3600; //1 hour
            string dayTimeInput = "1/1/2030 08:30:00";
            string veicDutyCodeInput = "0123456789";

            WorkBlockGeneratorDto input = new WorkBlockGeneratorDto(numberOfBlocksInput, numberOfSecondsInput, dayTimeInput, veicDutyCodeInput, inputTrips);

            WorkBlockDto[] expResultWorkBlockList = new WorkBlockDto[2];
            expResultWorkBlockList[0] = new WorkBlockDto("", null, veicDutyCodeInput, "1/1/2030", "08:30:00", "1/1/2030", "09:30:00", new string[] { "trip1" });
            expResultWorkBlockList[1] = new WorkBlockDto("", null, veicDutyCodeInput, "1/1/2030", "09:30:00", "1/1/2030", "10:30:00", new string[] { "trip1", "trip2" });

            WorkBlockGeneratedDto expResult = new WorkBlockGeneratedDto(expResultWorkBlockList);

            //Declare intermediate operation results
            LineDto lineOfTripDto = new LineDto();
            lineOfTripDto.AllowedVehicles = new List<string>();

            Vehicle veic = new Vehicle("09-09-AA", "00000000000000000", "testType", "12/12/2000");
            VehicleDuty veicDutyOfDto = new VehicleDuty(veicDutyCodeInput, "09-09-AA");

            List<Trip> tripsOfDtoList = new List<Trip>();
            tripsOfDtoList.Add(new Trip("a", "a", new List<int>() { 32400, 36000 }));    //From 9:00h to 10:00h  -> overlaps with workblock 0 and 1
            tripsOfDtoList.Add(new Trip("a", "a", new List<int>() { 36000, 39600 }));   //From 10:00h to 11:00h -> overlaps with workblock 1

            List<WorkBlock> workBlocksOfVeicDutyList = new List<WorkBlock>();   //Empty cause no workblocks have been created for the vehicle duty yet

            //Mock Dependencies
            var unitOfWork = new Mock<IUnitOfWork>();
            unitOfWork.Setup(o => o.CommitAsync())
                .Returns(Task.FromResult(200));

            // Mock the handler
            var mockHttpMessageHandler = new Mock<HttpMessageHandler>();

            string dataFromLineRequest = "[{\"key\":\"a\",\"name\":\"a\",\"terminalNode1\":\"WorkBlockTestNode01\",\"terminalNode2\":\"WorkBlockTestNode02\",\"RGB\":{\"red\":0,\"green\":0,\"blue\":0},\"AllowedVehicles\":[],\"AllowedDrivers\":[]}]";

            // Setup Protected method on HttpMessageHandler mock.
            mockHttpMessageHandler.Protected()
                .Setup<Task<HttpResponseMessage>>(
                    "SendAsync",
                    ItExpr.IsAny<HttpRequestMessage>(),
                    ItExpr.IsAny<CancellationToken>()
                ).ReturnsAsync(new HttpResponseMessage()
                {
                    StatusCode = HttpStatusCode.OK,
                    Content = new StringContent(dataFromLineRequest)
                });

            // use real http client with mocked handler here
            var httpClient = new HttpClient(mockHttpMessageHandler.Object)
            {
                BaseAddress = new Uri("http://test.com/"),
            };

            var clientFactory = new Mock<IHttpClientFactory>();

            // setup the method call
            clientFactory.Setup(x => x.CreateClient(It.IsAny<String>()))
                .Returns(httpClient);

            var lineMapper = new LineMapper();

            var workBlockMapper = new WorkBlockMapper();

            var vehicleRepository = new Mock<IVehicleRepository>();
            vehicleRepository.Setup(o => o.GetByIdAsync(It.IsAny<VehicleLicense>()))
                .Returns(Task.FromResult(veic));

            var vehicleDutyRepository = new Mock<IVehicleDutyRepository>();
            vehicleDutyRepository.Setup(o => o.GetByIdAsync(It.IsAny<VehicleDutyCode>()))
                .Returns(Task.FromResult((VehicleDuty)null));

            var tripRepository = new Mock<ITripRepository>();
            tripRepository.Setup(o => o.GetByIdsAsync(It.IsAny<List<TripKey>>()))
                .Returns(Task.FromResult(tripsOfDtoList));

            var workBlockRepository = new Mock<IWorkBlockRepository>();
            workBlockRepository.Setup(o => o.GetAllByVehicleDutyAsync(It.IsAny<VehicleDutyCode>()))
                .Returns(Task.FromResult(workBlocksOfVeicDutyList));

            //Run the service
            var serv = new WorkBlocksOfVehicleDutyService(unitOfWork.Object, clientFactory.Object, vehicleRepository.Object,
                vehicleDutyRepository.Object, tripRepository.Object, workBlockRepository.Object, lineMapper, workBlockMapper);

            var httpContext = new DefaultHttpContext();
            httpContext.Request.Headers["Authorization"] = "Bearer 215418152";

            var contr = new RegisterVehicleDutyWorkBlocksController(serv)
            {
                ControllerContext = new ControllerContext()
                {
                    HttpContext = httpContext
                }
            };



            //Check if results are correct
            ActionResult<WorkBlockGeneratedDto> result = await contr.Register(input);

            Assert.IsType<ContentResult>(result.Result);

            ContentResult res = (ContentResult)result.Result;

            //Chcks if the value of the task is correct
            Assert.Equal("Vehicle Duty " + input.VehicleDuty + " does not exist.", res.Content);
            Assert.Equal("Json", res.ContentType);
            Assert.Equal(400, res.StatusCode);
        }

        [Fact]
        public async void ShouldRegisterWorkBlocks_VehicleDutyVehicleDoesNotExist_1()
        {
            //Declare input and expected result
            List<string> inputTrips = new List<string>();
            inputTrips.Add("trip1");
            inputTrips.Add("trip2");

            uint numberOfBlocksInput = 2;
            uint numberOfSecondsInput = 3600; //1 hour
            string dayTimeInput = "1/1/2030 08:30:00";
            string veicDutyCodeInput = "0123456789";

            WorkBlockGeneratorDto input = new WorkBlockGeneratorDto(numberOfBlocksInput, numberOfSecondsInput, dayTimeInput, veicDutyCodeInput, inputTrips);

            WorkBlockDto[] expResultWorkBlockList = new WorkBlockDto[2];
            expResultWorkBlockList[0] = new WorkBlockDto("",null, veicDutyCodeInput, "1/1/2030", "08:30:00", "1/1/2030", "09:30:00", new string[] { "trip1" });
            expResultWorkBlockList[1] = new WorkBlockDto("",null, veicDutyCodeInput, "1/1/2030", "09:30:00", "1/1/2030", "10:30:00", new string[] { "trip1", "trip2" });

            WorkBlockGeneratedDto expResult = new WorkBlockGeneratedDto(expResultWorkBlockList);

            //Declare intermediate operation results
            LineDto lineOfTripDto = new LineDto();
            lineOfTripDto.AllowedVehicles = new List<string>();

            Vehicle veic = new Vehicle("09-09-AA", "00000000000000000", "testType", "12/12/2000");
            VehicleDuty veicDutyOfDto = new VehicleDuty(veicDutyCodeInput, "09-09-AA");

            List<Trip> tripsOfDtoList = new List<Trip>();
            tripsOfDtoList.Add(new Trip("a", "a", new List<int>() { 32400, 36000 }));    //From 9:00h to 10:00h  -> overlaps with workblock 0 and 1
            tripsOfDtoList.Add(new Trip("a", "a", new List<int>() { 36000, 39600 }));   //From 10:00h to 11:00h -> overlaps with workblock 1

            List<WorkBlock> workBlocksOfVeicDutyList = new List<WorkBlock>();   //Empty cause no workblocks have been created for the vehicle duty yet

            //Mock Dependencies
            var unitOfWork = new Mock<IUnitOfWork>();
            unitOfWork.Setup(o => o.CommitAsync())
                .Returns(Task.FromResult(200));

            // Mock the handler
            var mockHttpMessageHandler = new Mock<HttpMessageHandler>();

            string dataFromLineRequest = "[{\"key\":\"a\",\"name\":\"a\",\"terminalNode1\":\"WorkBlockTestNode01\",\"terminalNode2\":\"WorkBlockTestNode02\",\"RGB\":{\"red\":0,\"green\":0,\"blue\":0},\"AllowedVehicles\":[],\"AllowedDrivers\":[]}]";

            // Setup Protected method on HttpMessageHandler mock.
            mockHttpMessageHandler.Protected()
                .Setup<Task<HttpResponseMessage>>(
                    "SendAsync",
                    ItExpr.IsAny<HttpRequestMessage>(),
                    ItExpr.IsAny<CancellationToken>()
                ).ReturnsAsync(new HttpResponseMessage()
                {
                    StatusCode = HttpStatusCode.OK,
                    Content = new StringContent(dataFromLineRequest)
                });

            // use real http client with mocked handler here
            var httpClient = new HttpClient(mockHttpMessageHandler.Object)
            {
                BaseAddress = new Uri("http://test.com/"),
            };

            var clientFactory = new Mock<IHttpClientFactory>();

            // setup the method call
            clientFactory.Setup(x => x.CreateClient(It.IsAny<String>()))
                .Returns(httpClient);

            var lineMapper = new LineMapper();

            var workBlockMapper = new WorkBlockMapper();

            var vehicleRepository = new Mock<IVehicleRepository>();
            vehicleRepository.Setup(o => o.GetByIdAsync(It.IsAny<VehicleLicense>()))
                .Returns(Task.FromResult((Vehicle)null));

            var vehicleDutyRepository = new Mock<IVehicleDutyRepository>();
            vehicleDutyRepository.Setup(o => o.GetByIdAsync(It.IsAny<VehicleDutyCode>()))
                .Returns(Task.FromResult(veicDutyOfDto));

            var tripRepository = new Mock<ITripRepository>();
            tripRepository.Setup(o => o.GetByIdsAsync(It.IsAny<List<TripKey>>()))
                .Returns(Task.FromResult(tripsOfDtoList));

            var workBlockRepository = new Mock<IWorkBlockRepository>();
            workBlockRepository.Setup(o => o.GetAllByVehicleDutyAsync(It.IsAny<VehicleDutyCode>()))
                .Returns(Task.FromResult(workBlocksOfVeicDutyList));

            //Run the service
            var serv = new WorkBlocksOfVehicleDutyService(unitOfWork.Object, clientFactory.Object, vehicleRepository.Object,
                vehicleDutyRepository.Object, tripRepository.Object, workBlockRepository.Object, lineMapper, workBlockMapper);

            var httpContext = new DefaultHttpContext();
            httpContext.Request.Headers["Authorization"] = "Bearer 215418152";

            var contr = new RegisterVehicleDutyWorkBlocksController(serv)
            {
                ControllerContext = new ControllerContext()
                {
                    HttpContext = httpContext
                }
            };



            //Check if results are correct
            ActionResult<WorkBlockGeneratedDto> result = await contr.Register(input);

            Assert.IsType<OkObjectResult>(result.Result);

            OkObjectResult res = (OkObjectResult)result.Result;

            Assert.Equal(200, res.StatusCode);
        }

        [Fact]
        public async void ShouldRegisterWorkBlocks_ExceptionOcurred_TripDoesNotExist_1()
        {
            //Declare input and expected result
            List<string> inputTrips = new List<string>();
            inputTrips.Add("trip1");
            inputTrips.Add("trip2");

            uint numberOfBlocksInput = 2;
            uint numberOfSecondsInput = 3600; //1 hour
            string dayTimeInput = "1/1/2030 08:30:00";
            string veicDutyCodeInput = "0123456789";

            WorkBlockGeneratorDto input = new WorkBlockGeneratorDto(numberOfBlocksInput, numberOfSecondsInput, dayTimeInput, veicDutyCodeInput, inputTrips);

            WorkBlockDto[] expResultWorkBlockList = new WorkBlockDto[2];
            expResultWorkBlockList[0] = new WorkBlockDto("", null, veicDutyCodeInput, "1/1/2030", "08:30:00", "1/1/2030", "09:30:00", new string[] { "trip1" });
            expResultWorkBlockList[1] = new WorkBlockDto("", null, veicDutyCodeInput, "1/1/2030", "09:30:00", "1/1/2030", "10:30:00", new string[] { "trip1", "trip2" });

            WorkBlockGeneratedDto expResult = new WorkBlockGeneratedDto(expResultWorkBlockList);

            //Declare intermediate operation results
            LineDto lineOfTripDto = new LineDto();
            lineOfTripDto.AllowedVehicles = new List<string>();

            Vehicle veic = new Vehicle("09-09-AA", "00000000000000000", "testType", "12/12/2000");
            VehicleDuty veicDutyOfDto = new VehicleDuty(veicDutyCodeInput, "09-09-AA");

            List<Trip> tripsOfDtoList = new List<Trip>();
            tripsOfDtoList.Add(new Trip("a", "a", new List<int>() { 32400, 36000 }));    //From 9:00h to 10:00h  -> overlaps with workblock 0 and 1
            tripsOfDtoList.Add(new Trip("a", "a", new List<int>() { 36000, 39600 }));   //From 10:00h to 11:00h -> overlaps with workblock 1

            List<WorkBlock> workBlocksOfVeicDutyList = new List<WorkBlock>();   //Empty cause no workblocks have been created for the vehicle duty yet

            //Mock Dependencies
            var unitOfWork = new Mock<IUnitOfWork>();
            unitOfWork.Setup(o => o.CommitAsync())
                .Returns(Task.FromResult(200));

            // Mock the handler
            var mockHttpMessageHandler = new Mock<HttpMessageHandler>();

            string dataFromLineRequest = "[{\"key\":\"a\",\"name\":\"a\",\"terminalNode1\":\"WorkBlockTestNode01\",\"terminalNode2\":\"WorkBlockTestNode02\",\"RGB\":{\"red\":0,\"green\":0,\"blue\":0},\"AllowedVehicles\":[],\"AllowedDrivers\":[]}]";

            // Setup Protected method on HttpMessageHandler mock.
            mockHttpMessageHandler.Protected()
                .Setup<Task<HttpResponseMessage>>(
                    "SendAsync",
                    ItExpr.IsAny<HttpRequestMessage>(),
                    ItExpr.IsAny<CancellationToken>()
                ).ReturnsAsync(new HttpResponseMessage()
                {
                    StatusCode = HttpStatusCode.OK,
                    Content = new StringContent(dataFromLineRequest)
                });

            // use real http client with mocked handler here
            var httpClient = new HttpClient(mockHttpMessageHandler.Object)
            {
                BaseAddress = new Uri("http://test.com/"),
            };

            var clientFactory = new Mock<IHttpClientFactory>();

            // setup the method call
            clientFactory.Setup(x => x.CreateClient(It.IsAny<String>()))
                .Returns(httpClient);

            var lineMapper = new LineMapper();

            var workBlockMapper = new WorkBlockMapper();

            var vehicleRepository = new Mock<IVehicleRepository>();
            vehicleRepository.Setup(o => o.GetByIdAsync(It.IsAny<VehicleLicense>()))
                .Returns(Task.FromResult(veic));

            var vehicleDutyRepository = new Mock<IVehicleDutyRepository>();
            vehicleDutyRepository.Setup(o => o.GetByIdAsync(It.IsAny<VehicleDutyCode>()))
                .Returns(Task.FromResult(veicDutyOfDto));

            var tripRepository = new Mock<ITripRepository>();
            tripRepository.Setup(o => o.GetByIdsAsync(It.IsAny<List<TripKey>>()))
                .Returns(Task.FromResult(new List<Trip>()));

            var workBlockRepository = new Mock<IWorkBlockRepository>();
            workBlockRepository.Setup(o => o.GetAllByVehicleDutyAsync(It.IsAny<VehicleDutyCode>()))
                .Returns(Task.FromResult(workBlocksOfVeicDutyList));

            //Run the service
            var serv = new WorkBlocksOfVehicleDutyService(unitOfWork.Object, clientFactory.Object, vehicleRepository.Object,
                vehicleDutyRepository.Object, tripRepository.Object, workBlockRepository.Object, lineMapper, workBlockMapper);

            var httpContext = new DefaultHttpContext();
            httpContext.Request.Headers["Authorization"] = "Bearer 215418152";

            var contr = new RegisterVehicleDutyWorkBlocksController(serv)
            {
                ControllerContext = new ControllerContext()
                {
                    HttpContext = httpContext
                }
            };



            //Check if results are correct
            ActionResult<WorkBlockGeneratedDto> result = await contr.Register(input);

            Assert.IsType<ContentResult>(result.Result);

            ContentResult res = (ContentResult)result.Result;

            //Chcks if the value of the task is correct
            Assert.Equal("At least one of the inserted trips does not exist.", res.Content);
            Assert.Equal("Json", res.ContentType);
            Assert.Equal(400, res.StatusCode);
        }

        [Fact]
        public async void ShouldRegisterWorkBlocks_ExceptionOcurred_LineDoesNotExist_1()
        {
            //Declare input and expected result
            List<string> inputTrips = new List<string>();
            inputTrips.Add("trip1");
            inputTrips.Add("trip2");

            uint numberOfBlocksInput = 2;
            uint numberOfSecondsInput = 3600; //1 hour
            string dayTimeInput = "1/1/2030 08:30:00";
            string veicDutyCodeInput = "0123456789";

            WorkBlockGeneratorDto input = new WorkBlockGeneratorDto(numberOfBlocksInput, numberOfSecondsInput, dayTimeInput, veicDutyCodeInput, inputTrips);

            WorkBlockDto[] expResultWorkBlockList = new WorkBlockDto[2];
            expResultWorkBlockList[0] = new WorkBlockDto("", null, veicDutyCodeInput, "1/1/2030", "08:30:00", "1/1/2030", "09:30:00", new string[] { "trip1" });
            expResultWorkBlockList[1] = new WorkBlockDto("", null, veicDutyCodeInput, "1/1/2030", "09:30:00", "1/1/2030", "10:30:00", new string[] { "trip1", "trip2" });

            WorkBlockGeneratedDto expResult = new WorkBlockGeneratedDto(expResultWorkBlockList);

            //Declare intermediate operation results
            LineDto lineOfTripDto = new LineDto();
            lineOfTripDto.AllowedVehicles = new List<string>();

            Vehicle veic = new Vehicle("09-09-AA", "00000000000000000", "testType", "12/12/2000");
            VehicleDuty veicDutyOfDto = new VehicleDuty(veicDutyCodeInput, "09-09-AA");

            List<Trip> tripsOfDtoList = new List<Trip>();
            tripsOfDtoList.Add(new Trip("a", "a", new List<int>() { 32400, 36000 }));    //From 9:00h to 10:00h  -> overlaps with workblock 0 and 1
            tripsOfDtoList.Add(new Trip("a", "a", new List<int>() { 36000, 39600 }));   //From 10:00h to 11:00h -> overlaps with workblock 1

            List<WorkBlock> workBlocksOfVeicDutyList = new List<WorkBlock>();   //Empty cause no workblocks have been created for the vehicle duty yet

            //Mock Dependencies
            var unitOfWork = new Mock<IUnitOfWork>();
            unitOfWork.Setup(o => o.CommitAsync())
                .Returns(Task.FromResult(200));

            // Mock the handler
            var mockHttpMessageHandler = new Mock<HttpMessageHandler>();

            string dataFromLineRequest = "[{\"key\":\"a\",\"name\":\"a\",\"terminalNode1\":\"WorkBlockTestNode01\",\"terminalNode2\":\"WorkBlockTestNode02\",\"RGB\":{\"red\":0,\"green\":0,\"blue\":0},\"AllowedVehicles\":[],\"AllowedDrivers\":[]}]";

            // Setup Protected method on HttpMessageHandler mock.
            mockHttpMessageHandler.Protected()
                .Setup<Task<HttpResponseMessage>>(
                    "SendAsync",
                    ItExpr.IsAny<HttpRequestMessage>(),
                    ItExpr.IsAny<CancellationToken>()
                ).ReturnsAsync(new HttpResponseMessage()
                {
                    StatusCode = HttpStatusCode.NotFound,
                    Content = new StringContent(dataFromLineRequest)
                });

            // use real http client with mocked handler here
            var httpClient = new HttpClient(mockHttpMessageHandler.Object)
            {
                BaseAddress = new Uri("http://test.com/"),
            };

            var clientFactory = new Mock<IHttpClientFactory>();

            // setup the method call
            clientFactory.Setup(x => x.CreateClient(It.IsAny<String>()))
                .Returns(httpClient);

            var lineMapper = new LineMapper();

            var workBlockMapper = new WorkBlockMapper();

            var vehicleRepository = new Mock<IVehicleRepository>();
            vehicleRepository.Setup(o => o.GetByIdAsync(It.IsAny<VehicleLicense>()))
                .Returns(Task.FromResult(veic));

            var vehicleDutyRepository = new Mock<IVehicleDutyRepository>();
            vehicleDutyRepository.Setup(o => o.GetByIdAsync(It.IsAny<VehicleDutyCode>()))
                .Returns(Task.FromResult(veicDutyOfDto));

            var tripRepository = new Mock<ITripRepository>();
            tripRepository.Setup(o => o.GetByIdsAsync(It.IsAny<List<TripKey>>()))
                .Returns(Task.FromResult(tripsOfDtoList));

            var workBlockRepository = new Mock<IWorkBlockRepository>();
            workBlockRepository.Setup(o => o.GetAllByVehicleDutyAsync(It.IsAny<VehicleDutyCode>()))
                .Returns(Task.FromResult(workBlocksOfVeicDutyList));

            //Run the service
            var serv = new WorkBlocksOfVehicleDutyService(unitOfWork.Object, clientFactory.Object, vehicleRepository.Object,
                vehicleDutyRepository.Object, tripRepository.Object, workBlockRepository.Object, lineMapper, workBlockMapper);

            var httpContext = new DefaultHttpContext();
            httpContext.Request.Headers["Authorization"] = "Bearer 215418152";

            var contr = new RegisterVehicleDutyWorkBlocksController(serv)
            {
                ControllerContext = new ControllerContext()
                {
                    HttpContext = httpContext
                }
            };



            //Check if results are correct
            ActionResult<WorkBlockGeneratedDto> result = await contr.Register(input);

            Assert.IsType<ContentResult>(result.Result);

            ContentResult res = (ContentResult)result.Result;

            //Chcks if the value of the task is correct
            Assert.Equal("Internal error: A trip's line does not exist.", res.Content);
            Assert.Equal("Json", res.ContentType);
            Assert.Equal(400, res.StatusCode);
        }

        [Fact]
        public async void ShouldRegisterWorkBlocks_ExceptionOcurred_VehicleTypeNotAllowedInLine_1()
        {
            //Declare input and expected result
            List<string> inputTrips = new List<string>();
            inputTrips.Add("trip1");
            inputTrips.Add("trip2");

            uint numberOfBlocksInput = 2;
            uint numberOfSecondsInput = 3600; //1 hour
            string dayTimeInput = "1/1/2030 08:30:00";
            string veicDutyCodeInput = "0123456789";

            WorkBlockGeneratorDto input = new WorkBlockGeneratorDto(numberOfBlocksInput, numberOfSecondsInput, dayTimeInput, veicDutyCodeInput, inputTrips);

            WorkBlockDto[] expResultWorkBlockList = new WorkBlockDto[2];
            expResultWorkBlockList[0] = new WorkBlockDto("", null, veicDutyCodeInput, "1/1/2030", "08:30:00", "1/1/2030", "09:30:00", new string[] { "trip1" });
            expResultWorkBlockList[1] = new WorkBlockDto("", null, veicDutyCodeInput, "1/1/2030", "09:30:00", "1/1/2030", "10:30:00", new string[] { "trip1", "trip2" });

            WorkBlockGeneratedDto expResult = new WorkBlockGeneratedDto(expResultWorkBlockList);

            //Declare intermediate operation results
            Vehicle veic = new Vehicle("09-09-AA", "00000000000000000", "testType", "12/12/2000");
            VehicleDuty veicDutyOfDto = new VehicleDuty(veicDutyCodeInput, "09-09-AA");

            List<Trip> tripsOfDtoList = new List<Trip>();
            tripsOfDtoList.Add(new Trip("a", "a", new List<int>() { 32400, 36000 }));    //From 9:00h to 10:00h  -> overlaps with workblock 0 and 1
            tripsOfDtoList.Add(new Trip("a", "a", new List<int>() { 36000, 39600 }));   //From 10:00h to 11:00h -> overlaps with workblock 1

            List<WorkBlock> workBlocksOfVeicDutyList = new List<WorkBlock>();   //Empty cause no workblocks have been created for the vehicle duty yet

            //Mock Dependencies
            var unitOfWork = new Mock<IUnitOfWork>();
            unitOfWork.Setup(o => o.CommitAsync())
                .Returns(Task.FromResult(200));

            // Mock the handler
            var mockHttpMessageHandler = new Mock<HttpMessageHandler>();

            string dataFromLineRequest = "[{\"key\":\"a\",\"name\":\"a\",\"terminalNode1\":\"WorkBlockTestNode01\",\"terminalNode2\":\"WorkBlockTestNode02\",\"RGB\":{\"red\":0,\"green\":0,\"blue\":0},\"AllowedVehicles\":[\"impossible\"],\"AllowedDrivers\":[]}]";

            // Setup Protected method on HttpMessageHandler mock.
            mockHttpMessageHandler.Protected()
                .Setup<Task<HttpResponseMessage>>(
                    "SendAsync",
                    ItExpr.IsAny<HttpRequestMessage>(),
                    ItExpr.IsAny<CancellationToken>()
                ).ReturnsAsync(new HttpResponseMessage()
                {
                    StatusCode = HttpStatusCode.OK,
                    Content = new StringContent(dataFromLineRequest)
                });

            // use real http client with mocked handler here
            var httpClient = new HttpClient(mockHttpMessageHandler.Object)
            {
                BaseAddress = new Uri("http://test.com/"),
            };

            var clientFactory = new Mock<IHttpClientFactory>();

            // setup the method call
            clientFactory.Setup(x => x.CreateClient(It.IsAny<String>()))
                .Returns(httpClient);

            var lineMapper = new LineMapper();

            var workBlockMapper = new WorkBlockMapper();

            var vehicleRepository = new Mock<IVehicleRepository>();
            vehicleRepository.Setup(o => o.GetByIdAsync(It.IsAny<VehicleLicense>()))
                .Returns(Task.FromResult(veic));

            var vehicleDutyRepository = new Mock<IVehicleDutyRepository>();
            vehicleDutyRepository.Setup(o => o.GetByIdAsync(It.IsAny<VehicleDutyCode>()))
                .Returns(Task.FromResult(veicDutyOfDto));

            var tripRepository = new Mock<ITripRepository>();
            tripRepository.Setup(o => o.GetByIdsAsync(It.IsAny<List<TripKey>>()))
                .Returns(Task.FromResult(tripsOfDtoList));

            var workBlockRepository = new Mock<IWorkBlockRepository>();
            workBlockRepository.Setup(o => o.GetAllByVehicleDutyAsync(It.IsAny<VehicleDutyCode>()))
                .Returns(Task.FromResult(workBlocksOfVeicDutyList));

            //Run the service
            var serv = new WorkBlocksOfVehicleDutyService(unitOfWork.Object, clientFactory.Object, vehicleRepository.Object,
                vehicleDutyRepository.Object, tripRepository.Object, workBlockRepository.Object, lineMapper, workBlockMapper);

            var httpContext = new DefaultHttpContext();
            httpContext.Request.Headers["Authorization"] = "Bearer 215418152";

            var contr = new RegisterVehicleDutyWorkBlocksController(serv)
            {
                ControllerContext = new ControllerContext()
                {
                    HttpContext = httpContext
                }
            };



            //Check if results are correct
            ActionResult<WorkBlockGeneratedDto> result = await contr.Register(input);

            Assert.IsType<ContentResult>(result.Result);

            ContentResult res = (ContentResult)result.Result;

            //Chcks if the value of the task is correct
            Assert.Equal("This vehicle is not allowed to perform trips in the line: " + "a"+ ".", res.Content);
            Assert.Equal("Json", res.ContentType);
            Assert.Equal(400, res.StatusCode);
        }

        [Fact]
        public async void ShouldRegisterWorkBlocks_ExceptionOcurred_TripNotAffectedToAWorkBlock_1()
        {
            //Declare input and expected result
            List<string> inputTrips = new List<string>();
            inputTrips.Add("trip1");
            inputTrips.Add("trip2");
            inputTrips.Add("trip3");

            uint numberOfBlocksInput = 2;
            uint numberOfSecondsInput = 3600; //1 hour
            string dayTimeInput = "1/1/2030 08:30:00";
            string veicDutyCodeInput = "0123456789";

            WorkBlockGeneratorDto input = new WorkBlockGeneratorDto(numberOfBlocksInput, numberOfSecondsInput, dayTimeInput, veicDutyCodeInput, inputTrips);

            WorkBlockDto[] expResultWorkBlockList = new WorkBlockDto[2];
            expResultWorkBlockList[0] = new WorkBlockDto("", null, veicDutyCodeInput, "1/1/2030", "08:30:00", "1/1/2030", "09:30:00", new string[] { "trip1" });
            expResultWorkBlockList[1] = new WorkBlockDto("", null, veicDutyCodeInput, "1/1/2030", "09:30:00", "1/1/2030", "10:30:00", new string[] { "trip1", "trip2" });

            WorkBlockGeneratedDto expResult = new WorkBlockGeneratedDto(expResultWorkBlockList);

            //Declare intermediate operation results
            Vehicle veic = new Vehicle("09-09-AA", "00000000000000000", "testType", "12/12/2000");
            VehicleDuty veicDutyOfDto = new VehicleDuty(veicDutyCodeInput, "09-09-AA");

            List<Trip> tripsOfDtoList = new List<Trip>();
            tripsOfDtoList.Add(new Trip("a", "a", new List<int>() { 32400, 36000 }));    //From 9:00h to 10:00h  -> overlaps with workblock 0 and 1
            tripsOfDtoList.Add(new Trip("a", "a", new List<int>() { 36000, 39600 }));   //From 10:00h to 11:00h -> overlaps with workblock 1
            tripsOfDtoList.Add(new Trip("a", "a", new List<int>() { 44000, 45600 }));   //Does not overlap with any workblock

            List<WorkBlock> workBlocksOfVeicDutyList = new List<WorkBlock>();   //Empty cause no workblocks have been created for the vehicle duty yet

            //Mock Dependencies
            var unitOfWork = new Mock<IUnitOfWork>();
            unitOfWork.Setup(o => o.CommitAsync())
                .Returns(Task.FromResult(200));

            // Mock the handler
            var mockHttpMessageHandler = new Mock<HttpMessageHandler>();

            string dataFromLineRequest = "[{\"key\":\"a\",\"name\":\"a\",\"terminalNode1\":\"WorkBlockTestNode01\",\"terminalNode2\":\"WorkBlockTestNode02\",\"RGB\":{\"red\":0,\"green\":0,\"blue\":0},\"AllowedVehicles\":[],\"AllowedDrivers\":[]}]";

            // Setup Protected method on HttpMessageHandler mock.
            mockHttpMessageHandler.Protected()
                .Setup<Task<HttpResponseMessage>>(
                    "SendAsync",
                    ItExpr.IsAny<HttpRequestMessage>(),
                    ItExpr.IsAny<CancellationToken>()
                ).ReturnsAsync(new HttpResponseMessage()
                {
                    StatusCode = HttpStatusCode.OK,
                    Content = new StringContent(dataFromLineRequest)
                });

            // use real http client with mocked handler here
            var httpClient = new HttpClient(mockHttpMessageHandler.Object)
            {
                BaseAddress = new Uri("http://test.com/"),
            };

            var clientFactory = new Mock<IHttpClientFactory>();

            // setup the method call
            clientFactory.Setup(x => x.CreateClient(It.IsAny<String>()))
                .Returns(httpClient);

            var lineMapper = new LineMapper();

            var workBlockMapper = new WorkBlockMapper();

            var vehicleRepository = new Mock<IVehicleRepository>();
            vehicleRepository.Setup(o => o.GetByIdAsync(It.IsAny<VehicleLicense>()))
                .Returns(Task.FromResult(veic));

            var vehicleDutyRepository = new Mock<IVehicleDutyRepository>();
            vehicleDutyRepository.Setup(o => o.GetByIdAsync(It.IsAny<VehicleDutyCode>()))
                .Returns(Task.FromResult(veicDutyOfDto));

            var tripRepository = new Mock<ITripRepository>();
            tripRepository.Setup(o => o.GetByIdsAsync(It.IsAny<List<TripKey>>()))
                .Returns(Task.FromResult(tripsOfDtoList));

            var workBlockRepository = new Mock<IWorkBlockRepository>();
            workBlockRepository.Setup(o => o.GetAllByVehicleDutyAsync(It.IsAny<VehicleDutyCode>()))
                .Returns(Task.FromResult(workBlocksOfVeicDutyList));

            //Run the service
            var serv = new WorkBlocksOfVehicleDutyService(unitOfWork.Object, clientFactory.Object, vehicleRepository.Object,
                vehicleDutyRepository.Object, tripRepository.Object, workBlockRepository.Object, lineMapper, workBlockMapper);

            var httpContext = new DefaultHttpContext();
            httpContext.Request.Headers["Authorization"] = "Bearer 215418152";

            var contr = new RegisterVehicleDutyWorkBlocksController(serv)
            {
                ControllerContext = new ControllerContext()
                {
                    HttpContext = httpContext
                }
            };



            //Check if results are correct
            ActionResult<WorkBlockGeneratedDto> result = await contr.Register(input);

            Assert.IsType<ContentResult>(result.Result);

            ContentResult res = (ContentResult)result.Result;

            //Chcks if the value of the task is correct
            Assert.Equal("The trip of path: 'a' starting at 12h:13m:20s could not be affected to a workblock.", res.Content);
            Assert.Equal("Json", res.ContentType);
            Assert.Equal(400, res.StatusCode);
        }

    }
}
