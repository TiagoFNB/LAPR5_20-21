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
using DDDNetCore.WorkBlocks.Domain;
using DDDNetCore.WorkBlocks.Domain.ValueObjects;
using DDDNetCore.WorkBlocks.Dto;
using DDDNetCore.WorkBlocks.Mappers;
using DDDNetCore.WorkBlocks.Repository;
using DDDNetCore.WorkBlocks.Services;
using DDDSample1.Domain.Shared;
using Moq;
using Moq.Protected;
using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using Xunit;

namespace XUnitTestMDV.WorkBlockTest.UnitTests.Services
{
    public class WorkBlocksOfVehicleDutyServiceTest
    {

        [Fact]
        public void ShouldRegisterWorkBlocks_NormalSituation1()
        {
            //Declare input and expected result
            List<string> inputTrips = new List<string>();
            inputTrips.Add("trip1");
            inputTrips.Add("trip2");

            uint numberOfBlocksInput = 2;
            uint numberOfSecondsInput = 3600; //1 hour
            string dayTimeInput = "01/01/2030 08:30:00";
            string veicDutyCodeInput = "0123456789";

            WorkBlockGeneratorDto input = new WorkBlockGeneratorDto(numberOfBlocksInput, numberOfSecondsInput, dayTimeInput, veicDutyCodeInput, inputTrips);

            WorkBlockDto[] expResultWorkBlockList = new WorkBlockDto[2];
            expResultWorkBlockList[0] = new WorkBlockDto("", null, veicDutyCodeInput, "01/01/2030", "08:30:00", "01/01/2030", "09:30:00", new string[] { "trip1" });
            expResultWorkBlockList[1] = new WorkBlockDto("", null, veicDutyCodeInput, "01/01/2030", "09:30:00", "01/01/2030", "10:30:00", new string[] { "trip1","trip2" });

            WorkBlockGeneratedDto expResult = new WorkBlockGeneratedDto(expResultWorkBlockList);

            //Declare intermediate operation results
            LineDto lineOfTripDto = new LineDto();
            lineOfTripDto.AllowedVehicles = new List<string>();

            Vehicle veic = new Vehicle("09-09-AA", "00000000000000000", "testType", "12/12/2000");
            VehicleDuty veicDutyOfDto = new VehicleDuty(veicDutyCodeInput, "09-09-AA");

            List<Trip> tripsOfDtoList = new List<Trip>();
            tripsOfDtoList.Add(new Trip("a","a",new List<int>() { 32400 , 36000 }));    //From 9:00h to 10:00h  -> overlaps with workblock 0 and 1
            tripsOfDtoList.Add(new Trip("a", "a", new List<int>() { 36000, 39600 }));   //From 10:00h to 11:00h -> overlaps with workblock 1

            List<WorkBlock> workBlocksOfVeicDutyList = new List<WorkBlock>();   //Empty cause no workblocks have been created for the vehicle duty yet

            //Mock Dependencies
            var unitOfWork = new Mock<IUnitOfWork>();
            unitOfWork.Setup(o => o.CommitAsync())
                .Returns(Task.FromResult(200));

            // Mock the handler
            var mockHttpMessageHandler = new Mock<HttpMessageHandler>();

            // Setup Protected method on HttpMessageHandler mock.
            mockHttpMessageHandler.Protected()
                .Setup<Task<HttpResponseMessage>>(
                    "SendAsync",
                    ItExpr.IsAny<HttpRequestMessage>(),
                    ItExpr.IsAny<CancellationToken>()
                ).ReturnsAsync(new HttpResponseMessage()
                {
                    StatusCode = HttpStatusCode.OK,
                    Content = null
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

            var lineMapper = new Mock<ILineMapper>();
            lineMapper.Setup(o => o.MapFromMdrToDtoAsync(It.IsAny<HttpContent>()))
                .Returns(Task.FromResult(lineOfTripDto));

            var workBlockMapper = new Mock<IWorkBlockMapper>();
            workBlockMapper.Setup(o => o.MapFromDomainToGeneratedDto(It.IsAny<List<WorkBlock>>()))
                .Returns(expResult);

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
                vehicleDutyRepository.Object, tripRepository.Object, workBlockRepository.Object, lineMapper.Object, workBlockMapper.Object);

            var result = serv.AddAsync("Bearer 215418152", input);

            //Check if results are correct
            Assert.Equal(result.Result.Wks.Length, expResult.Wks.Length);

        }

        [Fact]
        public void ShouldRegisterWorkBlocks_NormalSituation2_VehicleFollowsLinesVehicleTypesRestrictions()
        {
            //Declare input and expected result
            List<string> inputTrips = new List<string>();
            inputTrips.Add("trip1");
            inputTrips.Add("trip2");

            uint numberOfBlocksInput = 2;
            uint numberOfSecondsInput = 3600; //1 hour
            string dayTimeInput = "01/01/2030 08:30:00";
            string veicDutyCodeInput = "0123456789";

            WorkBlockGeneratorDto input = new WorkBlockGeneratorDto(numberOfBlocksInput, numberOfSecondsInput, dayTimeInput, veicDutyCodeInput, inputTrips);

            WorkBlockDto[] expResultWorkBlockList = new WorkBlockDto[2];
            expResultWorkBlockList[0] = new WorkBlockDto("", null, veicDutyCodeInput, "01/01/2030", "08:30:00", "01/01/2030", "09:30:00", new string[] { "trip1" });
            expResultWorkBlockList[1] = new WorkBlockDto("", null, veicDutyCodeInput, "01/01/2030", "09:30:00", "01/01/2030", "10:30:00", new string[] { "trip1", "trip2" });

            WorkBlockGeneratedDto expResult = new WorkBlockGeneratedDto(expResultWorkBlockList);

            //Declare intermediate operation results
            string vehicleType = "testType";

            Vehicle veic = new Vehicle("09-09-AA", "00000000000000000", vehicleType, "12/12/2000");
            VehicleDuty veicDutyOfDto = new VehicleDuty(veicDutyCodeInput, "09-09-AA");

            LineDto lineOfTripDto = new LineDto();
            lineOfTripDto.AllowedVehicles = new List<string>() { vehicleType };

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

            // Setup Protected method on HttpMessageHandler mock.
            mockHttpMessageHandler.Protected()
                .Setup<Task<HttpResponseMessage>>(
                    "SendAsync",
                    ItExpr.IsAny<HttpRequestMessage>(),
                    ItExpr.IsAny<CancellationToken>()
                ).ReturnsAsync(new HttpResponseMessage()
                {
                    StatusCode = HttpStatusCode.OK,
                    Content = null
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

            var lineMapper = new Mock<ILineMapper>();
            lineMapper.Setup(o => o.MapFromMdrToDtoAsync(It.IsAny<HttpContent>()))
                .Returns(Task.FromResult(lineOfTripDto));

            var workBlockMapper = new Mock<IWorkBlockMapper>();
            workBlockMapper.Setup(o => o.MapFromDomainToGeneratedDto(It.IsAny<List<WorkBlock>>()))
                .Returns(expResult);

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
                vehicleDutyRepository.Object, tripRepository.Object, workBlockRepository.Object, lineMapper.Object, workBlockMapper.Object);

            var result = serv.AddAsync("Bearer 215418152", input);

            //Check if results are correct
            Assert.Equal(result.Result.Wks.Length, expResult.Wks.Length);

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
            string dayTimeInput = "01/01/2030 08:30:00";
            string veicDutyCodeInput = "0123456789";

            WorkBlockGeneratorDto input = new WorkBlockGeneratorDto(numberOfBlocksInput, numberOfSecondsInput, dayTimeInput, veicDutyCodeInput, inputTrips);

            WorkBlockDto[] expResultWorkBlockList = new WorkBlockDto[2];
            expResultWorkBlockList[0] = new WorkBlockDto("", null, veicDutyCodeInput, "01/01/2030", "08:30:00", "01/01/2030", "09:30:00", new string[] { "trip1" });
            expResultWorkBlockList[1] = new WorkBlockDto("", null, veicDutyCodeInput, "01/01/2030", "09:30:00", "01/01/2030", "10:30:00", new string[] { "trip1", "trip2" });

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

            // Setup Protected method on HttpMessageHandler mock.
            mockHttpMessageHandler.Protected()
                .Setup<Task<HttpResponseMessage>>(
                    "SendAsync",
                    ItExpr.IsAny<HttpRequestMessage>(),
                    ItExpr.IsAny<CancellationToken>()
                ).ReturnsAsync(new HttpResponseMessage()
                {
                    StatusCode = HttpStatusCode.OK,
                    Content = null
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

            var lineMapper = new Mock<ILineMapper>();
            lineMapper.Setup(o => o.MapFromMdrToDtoAsync(It.IsAny<HttpContent>()))
                .Returns(Task.FromResult(lineOfTripDto));

            var workBlockMapper = new Mock<IWorkBlockMapper>();
            workBlockMapper.Setup(o => o.MapFromDomainToGeneratedDto(It.IsAny<List<WorkBlock>>()))
                .Returns(expResult);

            var vehicleRepository = new Mock<IVehicleRepository>();
            vehicleRepository.Setup(o => o.GetByIdAsync(It.IsAny<VehicleLicense>()))
                .Returns(Task.FromResult(veic));

            var vehicleDutyRepository = new Mock<IVehicleDutyRepository>();
            vehicleDutyRepository.Setup(o => o.GetByIdAsync(It.IsAny<VehicleDutyCode>()))
                .Returns(Task.FromResult((VehicleDuty) null));

            var tripRepository = new Mock<ITripRepository>();
            tripRepository.Setup(o => o.GetByIdsAsync(It.IsAny<List<TripKey>>()))
                .Returns(Task.FromResult(tripsOfDtoList));

            var workBlockRepository = new Mock<IWorkBlockRepository>();
            workBlockRepository.Setup(o => o.GetAllByVehicleDutyAsync(It.IsAny<VehicleDutyCode>()))
                .Returns(Task.FromResult(workBlocksOfVeicDutyList));

            //Run the service
            var serv = new WorkBlocksOfVehicleDutyService(unitOfWork.Object, clientFactory.Object, vehicleRepository.Object,
                vehicleDutyRepository.Object, tripRepository.Object, workBlockRepository.Object, lineMapper.Object, workBlockMapper.Object);

            try
            {
                var result = await serv.AddAsync("Bearer 215418152", input);

                Assert.True(false); //If it reaches here it should fail
            }catch(Exception e)
            {
                Assert.Equal(e.Message, "Vehicle Duty " + input.VehicleDuty + " does not exist.");
            }

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
            string dayTimeInput = "01/01/2030 08:30:00";
            string veicDutyCodeInput = "0123456789";

            WorkBlockGeneratorDto input = new WorkBlockGeneratorDto(numberOfBlocksInput, numberOfSecondsInput, dayTimeInput, veicDutyCodeInput, inputTrips);

            WorkBlockDto[] expResultWorkBlockList = new WorkBlockDto[2];
            expResultWorkBlockList[0] = new WorkBlockDto("", null, veicDutyCodeInput, "01/01/2030", "08:30:00", "01/01/2030", "09:30:00", new string[] { "trip1" });
            expResultWorkBlockList[1] = new WorkBlockDto("", null, veicDutyCodeInput, "01/01/2030", "09:30:00", "01/01/2030", "10:30:00", new string[] { "trip1", "trip2" });

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

            // Setup Protected method on HttpMessageHandler mock.
            mockHttpMessageHandler.Protected()
                .Setup<Task<HttpResponseMessage>>(
                    "SendAsync",
                    ItExpr.IsAny<HttpRequestMessage>(),
                    ItExpr.IsAny<CancellationToken>()
                ).ReturnsAsync(new HttpResponseMessage()
                {
                    StatusCode = HttpStatusCode.OK,
                    Content = null
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

            var lineMapper = new Mock<ILineMapper>();
            lineMapper.Setup(o => o.MapFromMdrToDtoAsync(It.IsAny<HttpContent>()))
                .Returns(Task.FromResult(lineOfTripDto));

            var workBlockMapper = new Mock<IWorkBlockMapper>();
            workBlockMapper.Setup(o => o.MapFromDomainToGeneratedDto(It.IsAny<List<WorkBlock>>()))
                .Returns(expResult);

            var vehicleRepository = new Mock<IVehicleRepository>();
            vehicleRepository.Setup(o => o.GetByIdAsync(It.IsAny<VehicleLicense>()))
                .Returns(Task.FromResult((Vehicle) null));

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
                vehicleDutyRepository.Object, tripRepository.Object, workBlockRepository.Object, lineMapper.Object, workBlockMapper.Object);

            //Check if results are correct
            try
            {
                var result = await serv.AddAsync("Bearer 215418152", input);

                Assert.True(result.Wks.Length==2); //If it reaches here it should fail
            }
            catch (Exception e)
            {
                Assert.True(false);
            }

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
            string dayTimeInput = "01/01/2030 08:30:00";
            string veicDutyCodeInput = "0123456789";

            WorkBlockGeneratorDto input = new WorkBlockGeneratorDto(numberOfBlocksInput, numberOfSecondsInput, dayTimeInput, veicDutyCodeInput, inputTrips);

            WorkBlockDto[] expResultWorkBlockList = new WorkBlockDto[2];
            expResultWorkBlockList[0] = new WorkBlockDto("", null, veicDutyCodeInput, "01/01/2030", "08:30:00", "01/01/2030", "09:30:00", new string[] { "trip1" });
            expResultWorkBlockList[1] = new WorkBlockDto("", null, veicDutyCodeInput, "01/01/2030", "09:30:00", "01/01/2030", "10:30:00", new string[] { "trip1", "trip2" });

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

            // Setup Protected method on HttpMessageHandler mock.
            mockHttpMessageHandler.Protected()
                .Setup<Task<HttpResponseMessage>>(
                    "SendAsync",
                    ItExpr.IsAny<HttpRequestMessage>(),
                    ItExpr.IsAny<CancellationToken>()
                ).ReturnsAsync(new HttpResponseMessage()
                {
                    StatusCode = HttpStatusCode.OK,
                    Content = null
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

            var lineMapper = new Mock<ILineMapper>();
            lineMapper.Setup(o => o.MapFromMdrToDtoAsync(It.IsAny<HttpContent>()))
                .Returns(Task.FromResult(lineOfTripDto));

            var workBlockMapper = new Mock<IWorkBlockMapper>();
            workBlockMapper.Setup(o => o.MapFromDomainToGeneratedDto(It.IsAny<List<WorkBlock>>()))
                .Returns(expResult);

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
                vehicleDutyRepository.Object, tripRepository.Object, workBlockRepository.Object, lineMapper.Object, workBlockMapper.Object);

            //Check if results are correct
            try
            {
                var result = await serv.AddAsync("Bearer 215418152", input);

                Assert.True(false); //If it reaches here it should fail
            }
            catch (Exception e)
            {
                Assert.Equal("At least one of the inserted trips does not exist.",e.Message);
            }

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
            string dayTimeInput = "01/01/2030 08:30:00";
            string veicDutyCodeInput = "0123456789";

            WorkBlockGeneratorDto input = new WorkBlockGeneratorDto(numberOfBlocksInput, numberOfSecondsInput, dayTimeInput, veicDutyCodeInput, inputTrips);

            WorkBlockDto[] expResultWorkBlockList = new WorkBlockDto[2];
            expResultWorkBlockList[0] = new WorkBlockDto("", null, veicDutyCodeInput, "01/01/2030", "08:30:00", "01/01/2030", "09:30:00", new string[] { "trip1" });
            expResultWorkBlockList[1] = new WorkBlockDto("", null, veicDutyCodeInput, "01/01/2030", "09:30:00", "01/01/2030", "10:30:00", new string[] { "trip1", "trip2" });

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

            // Setup Protected method on HttpMessageHandler mock.
            mockHttpMessageHandler.Protected()
                .Setup<Task<HttpResponseMessage>>(
                    "SendAsync",
                    ItExpr.IsAny<HttpRequestMessage>(),
                    ItExpr.IsAny<CancellationToken>()
                ).ReturnsAsync(new HttpResponseMessage()
                {
                    StatusCode = HttpStatusCode.NotFound,
                    Content = null
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

            var lineMapper = new Mock<ILineMapper>();
            lineMapper.Setup(o => o.MapFromMdrToDtoAsync(It.IsAny<HttpContent>()))
                .Returns(Task.FromResult(lineOfTripDto));

            var workBlockMapper = new Mock<IWorkBlockMapper>();
            workBlockMapper.Setup(o => o.MapFromDomainToGeneratedDto(It.IsAny<List<WorkBlock>>()))
                .Returns(expResult);

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
                vehicleDutyRepository.Object, tripRepository.Object, workBlockRepository.Object, lineMapper.Object, workBlockMapper.Object);

            //Check if results are correct
            try
            {
                var result = await serv.AddAsync("Bearer 215418152", input);

                Assert.True(false); //If it reaches here it should fail
            }
            catch (Exception e)
            {
                Assert.Equal("Internal error: A trip's line does not exist.", e.Message);
            }

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
            string dayTimeInput = "01/01/2030 08:30:00";
            string veicDutyCodeInput = "0123456789";

            WorkBlockGeneratorDto input = new WorkBlockGeneratorDto(numberOfBlocksInput, numberOfSecondsInput, dayTimeInput, veicDutyCodeInput, inputTrips);

            WorkBlockDto[] expResultWorkBlockList = new WorkBlockDto[2];
            expResultWorkBlockList[0] = new WorkBlockDto("", null, veicDutyCodeInput, "01/01/2030", "08:30:00", "01/01/2030", "09:30:00", new string[] { "trip1" });
            expResultWorkBlockList[1] = new WorkBlockDto("", null, veicDutyCodeInput, "01/01/2030", "09:30:00", "01/01/2030", "10:30:00", new string[] { "trip1", "trip2" });

            WorkBlockGeneratedDto expResult = new WorkBlockGeneratedDto(expResultWorkBlockList);

            //Declare intermediate operation results
            LineDto lineOfTripDto = new LineDto();
            lineOfTripDto.name = "testLine";
            lineOfTripDto.AllowedVehicles = new List<string>() { "impossiblevehicleType"};

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

            // Setup Protected method on HttpMessageHandler mock.
            mockHttpMessageHandler.Protected()
                .Setup<Task<HttpResponseMessage>>(
                    "SendAsync",
                    ItExpr.IsAny<HttpRequestMessage>(),
                    ItExpr.IsAny<CancellationToken>()
                ).ReturnsAsync(new HttpResponseMessage()
                {
                    StatusCode = HttpStatusCode.OK,
                    Content = null
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

            var lineMapper = new Mock<ILineMapper>();
            lineMapper.Setup(o => o.MapFromMdrToDtoAsync(It.IsAny<HttpContent>()))
                .Returns(Task.FromResult(lineOfTripDto));

            var workBlockMapper = new Mock<IWorkBlockMapper>();
            workBlockMapper.Setup(o => o.MapFromDomainToGeneratedDto(It.IsAny<List<WorkBlock>>()))
                .Returns(expResult);

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
                vehicleDutyRepository.Object, tripRepository.Object, workBlockRepository.Object, lineMapper.Object, workBlockMapper.Object);

            //Check if results are correct
            try
            {
                var result = await serv.AddAsync("Bearer 215418152", input);

                Assert.True(false); //If it reaches here it should fail
            }
            catch (Exception e)
            {
                Assert.Equal("This vehicle is not allowed to perform trips in the line: " + lineOfTripDto.name + ".", e.Message);
            }

        }

        [Fact]
        public async void ShouldRegisterWorkBlocks_ExceptionOcurred_WorkblocksAlreadyAssignedToAnotherDay_1()
        {
            //Declare input and expected result
            List<string> inputTrips = new List<string>();
            inputTrips.Add("trip1");
            inputTrips.Add("trip2");

            uint numberOfBlocksInput = 2;
            uint numberOfSecondsInput = 3600; //1 hour
            string dayTimeInput = "01/01/2030 08:30:00";
            string veicDutyCodeInput = "0123456789";

            WorkBlockGeneratorDto input = new WorkBlockGeneratorDto(numberOfBlocksInput, numberOfSecondsInput, dayTimeInput, veicDutyCodeInput, inputTrips);

            WorkBlockDto[] expResultWorkBlockList = new WorkBlockDto[2];
            expResultWorkBlockList[0] = new WorkBlockDto("", null, veicDutyCodeInput, "01/01/2030", "08:30:00", "01/01/2030", "09:30:00", new string[] { "trip1" });
            expResultWorkBlockList[1] = new WorkBlockDto("", null, veicDutyCodeInput, "01/01/2030", "09:30:00", "01/01/2030", "10:30:00", new string[] { "trip1", "trip2" });

            WorkBlockGeneratedDto expResult = new WorkBlockGeneratedDto(expResultWorkBlockList);

            //Declare intermediate operation results
            LineDto lineOfTripDto = new LineDto();
            lineOfTripDto.name = "testLine";
            lineOfTripDto.AllowedVehicles = new List<string>();

            Vehicle veic = new Vehicle("09-09-AA", "00000000000000000", "testType", "12/12/2000");
            VehicleDuty veicDutyOfDto = new VehicleDuty(veicDutyCodeInput, "09-09-AA");

            List<Trip> tripsOfDtoList = new List<Trip>();
            tripsOfDtoList.Add(new Trip("a", "a", new List<int>() { 32400, 36000 }));    //From 9:00h to 10:00h  -> overlaps with workblock 0 and 1
            tripsOfDtoList.Add(new Trip("a", "a", new List<int>() { 36000, 39600 }));   //From 10:00h to 11:00h -> overlaps with workblock 1

            WorkBlock elem0 = new WorkBlock();
            elem0.StartDateTime = new WorkBlockStartDateTime(new DateTime(1993,5,5));
            List<WorkBlock> workBlocksOfVeicDutyList = new List<WorkBlock>() { elem0 };   


            //Mock Dependencies
            var unitOfWork = new Mock<IUnitOfWork>();
            unitOfWork.Setup(o => o.CommitAsync())
                .Returns(Task.FromResult(200));

            // Mock the handler
            var mockHttpMessageHandler = new Mock<HttpMessageHandler>();

            // Setup Protected method on HttpMessageHandler mock.
            mockHttpMessageHandler.Protected()
                .Setup<Task<HttpResponseMessage>>(
                    "SendAsync",
                    ItExpr.IsAny<HttpRequestMessage>(),
                    ItExpr.IsAny<CancellationToken>()
                ).ReturnsAsync(new HttpResponseMessage()
                {
                    StatusCode = HttpStatusCode.OK,
                    Content = null
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

            var lineMapper = new Mock<ILineMapper>();
            lineMapper.Setup(o => o.MapFromMdrToDtoAsync(It.IsAny<HttpContent>()))
                .Returns(Task.FromResult(lineOfTripDto));

            var workBlockMapper = new Mock<IWorkBlockMapper>();
            workBlockMapper.Setup(o => o.MapFromDomainToGeneratedDto(It.IsAny<List<WorkBlock>>()))
                .Returns(expResult);

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
                vehicleDutyRepository.Object, tripRepository.Object, workBlockRepository.Object, lineMapper.Object, workBlockMapper.Object);

            //Check if results are correct
            try
            {
                var result = await serv.AddAsync("Bearer 215418152", input);

                Assert.True(false); //If it reaches here it should fail
            }
            catch (Exception e)
            {
                Assert.Equal("The given Vehicle Duty already has WorkBlocks assigned to another day.", e.Message);
            }

        }

        [Fact]
        public async void ShouldRegisterWorkBlocks_ExceptionOcurred_0BlocksToCreate_1()
        {
            //Declare input and expected result
            List<string> inputTrips = new List<string>();
            inputTrips.Add("trip1");
            inputTrips.Add("trip2");

            uint numberOfBlocksInput = 0;
            uint numberOfSecondsInput = 3600; //1 hour
            string dayTimeInput = "01/01/2030 08:30:00";
            string veicDutyCodeInput = "0123456789";

            WorkBlockGeneratorDto input = new WorkBlockGeneratorDto(numberOfBlocksInput, numberOfSecondsInput, dayTimeInput, veicDutyCodeInput, inputTrips);

            WorkBlockDto[] expResultWorkBlockList = new WorkBlockDto[2];
            expResultWorkBlockList[0] = new WorkBlockDto("", null, veicDutyCodeInput, "01/01/2030", "08:30:00", "01/01/2030", "09:30:00", new string[] { "trip1" });
            expResultWorkBlockList[1] = new WorkBlockDto("", null, veicDutyCodeInput, "01/01/2030", "09:30:00", "01/01/2030", "10:30:00", new string[] { "trip1", "trip2" });

            WorkBlockGeneratedDto expResult = new WorkBlockGeneratedDto(expResultWorkBlockList);

            //Declare intermediate operation results
            LineDto lineOfTripDto = new LineDto();
            lineOfTripDto.name = "testLine";
            lineOfTripDto.AllowedVehicles = new List<string>();

            Vehicle veic = new Vehicle("09-09-AA", "00000000000000000", "testType", "12/12/2000");
            VehicleDuty veicDutyOfDto = new VehicleDuty(veicDutyCodeInput, "09-09-AA");

            List<Trip> tripsOfDtoList = new List<Trip>();
            tripsOfDtoList.Add(new Trip("a", "a", new List<int>() { 32400, 36000 }));    //From 9:00h to 10:00h  -> overlaps with workblock 0 and 1
            tripsOfDtoList.Add(new Trip("a", "a", new List<int>() { 36000, 39600 }));   //From 10:00h to 11:00h -> overlaps with workblock 1

            WorkBlock elem0 = new WorkBlock();
            elem0.StartDateTime = new WorkBlockStartDateTime(new DateTime(1993, 5, 5));
            List<WorkBlock> workBlocksOfVeicDutyList = new List<WorkBlock>();   //Empty cause no workblocks have been created for the vehicle duty yet


            //Mock Dependencies
            var unitOfWork = new Mock<IUnitOfWork>();
            unitOfWork.Setup(o => o.CommitAsync())
                .Returns(Task.FromResult(200));

            // Mock the handler
            var mockHttpMessageHandler = new Mock<HttpMessageHandler>();

            // Setup Protected method on HttpMessageHandler mock.
            mockHttpMessageHandler.Protected()
                .Setup<Task<HttpResponseMessage>>(
                    "SendAsync",
                    ItExpr.IsAny<HttpRequestMessage>(),
                    ItExpr.IsAny<CancellationToken>()
                ).ReturnsAsync(new HttpResponseMessage()
                {
                    StatusCode = HttpStatusCode.OK,
                    Content = null
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

            var lineMapper = new Mock<ILineMapper>();
            lineMapper.Setup(o => o.MapFromMdrToDtoAsync(It.IsAny<HttpContent>()))
                .Returns(Task.FromResult(lineOfTripDto));

            var workBlockMapper = new Mock<IWorkBlockMapper>();
            workBlockMapper.Setup(o => o.MapFromDomainToGeneratedDto(It.IsAny<List<WorkBlock>>()))
                .Returns(expResult);

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
                vehicleDutyRepository.Object, tripRepository.Object, workBlockRepository.Object, lineMapper.Object, workBlockMapper.Object);

            //Check if results are correct
            try
            {
                var result = await serv.AddAsync("Bearer 215418152", input);

                Assert.True(false); //If it reaches here it should fail
            }
            catch (Exception e)
            {
                Assert.Equal("No space to create any WorkBlock with the specified duration.", e.Message);
            }

        }

    }
}
