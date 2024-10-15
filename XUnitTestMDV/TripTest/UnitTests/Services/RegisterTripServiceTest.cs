using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using DDDNetCore.Drivers.Dto;
using DDDNetCore.Drivers.Mappers;
using DDDNetCore.Drivers.Repository;
using DDDNetCore.Drivers.Services;
using DDDNetCore.Trips.Domain;
using DDDNetCore.Trips.Domain.ValueObjects;
using DDDNetCore.Trips.DTO;
using DDDNetCore.Trips.Repository;
using DDDNetCore.Trips.Services;
using DDDSample1.Domain.Shared;
using Moq;
using Moq.Protected;
using Xunit;

namespace XUnitTestMDV.TripTest.UnitTests.Services
{
    public class RegisterTripServiceTest
    {
        [Fact]
        public async void ShouldRegisterTrip_NormalSituation1()
        {
            List<int> passing = new List<int>();
            passing.Add(50);
            passing.Add(55);
            string path = "pathId";
            string line = "lineId";
            List<PassingTime> Lpassings = new List<PassingTime>();
            Lpassings.Add(new PassingTime(50));
            Lpassings.Add(new PassingTime(55));
            Trip domainObj = new Trip(path, line, passing);
            RegisterTripsDto inputObj = new RegisterTripsDto(path,line,50,0,0);
            ResponseTripDto outputObj = new ResponseTripDto(domainObj.Id.Value, path, line, Lpassings);

            //Mock dependencies
            var unitOfWork = new Mock<IUnitOfWork>();
            unitOfWork.Setup(o => o.CommitAsync())
                .Returns(Task.FromResult(200));

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

            var tripRepo = new Mock<ITripRepository>();
            tripRepo.Setup(o => o.GetListTripsFromPathByTime("pathId", "lineId", 50))
                .Returns(Task.FromResult(new List<Trip>()));
            tripRepo.SetupSequence(o => o.AddAsync(It.IsAny<Trip>()))
                .Returns(Task.FromResult(domainObj));

            var mapper = new Mock<ITripMapper>();
            mapper.Setup(o => o.MapFromRegisterTripDtoToDomain(It.IsAny<RegisterTripsDto>()))
               .Returns(domainObj);
            mapper.Setup(o => o.MapFromDomain2Dto(It.IsAny<Trip>()))
               .Returns(outputObj);




            //Run the service
            var serv = new RegisterTripService(httpClientFactoryMock.Object, unitOfWork.Object, tripRepo.Object, mapper.Object);

            var result = await serv.AddAsync("Bearer 215418152", inputObj);

            //Checks if the action was completed successfully

            ////Chcks if the value of the task is correct
            Assert.Equal(inputObj.PathId, result[0].PathId);
            Assert.Equal(inputObj.LineId, result[0].LineId);
            Assert.Equal(inputObj.StartingTime, result[0].PassingTimes[0]);

        }

        [Fact]
        public async void ShouldRegisterTrips_NormalSituation1()
        {
            List<int> passing = new List<int>();
            passing.Add(50);
            passing.Add(55);
            string pathId = "pathId";
            string lineId = "lineId";
            List<PassingTime> Lpassings = new List<PassingTime>();
            Lpassings.Add(new PassingTime(50));
            Lpassings.Add(new PassingTime(55));
            //Obtain the domain objects
            Trip domainObj = new Trip(pathId, lineId, passing);
            RegisterTripsDto inputObj = new RegisterTripsDto(pathId, lineId, 50, 55, 3);
            ResponseTripDto outputObj = new ResponseTripDto(domainObj.Id.Value, pathId, lineId, Lpassings);

            //Mock dependencies
            var unitOfWork = new Mock<IUnitOfWork>();
            unitOfWork.Setup(o => o.CommitAsync())
                .Returns(Task.FromResult(200));

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

            Trip anotherDomainObj = domainObj;
            anotherDomainObj.PassingTimes[0] = new PassingTime(53);
            anotherDomainObj.PassingTimes[1] = new PassingTime(58);

            var tripRepo = new Mock<ITripRepository>();
            tripRepo.Setup(o => o.GetListTripsFromPathByTime("pathId", "lineId", 50))
                .Returns(Task.FromResult(new List<Trip>()));
            tripRepo.Setup(o => o.GetListTripsFromPathByTime("pathId", "lineId", 53))
                .Returns(Task.FromResult(new List<Trip>()));
            tripRepo.SetupSequence(o => o.AddAsync(It.IsAny<Trip>()))
                .Returns(Task.FromResult(domainObj))
                .Returns(Task.FromResult(anotherDomainObj));


            Lpassings[0] = new PassingTime(53);
            Lpassings[1] = new PassingTime(58);
            ResponseTripDto outputObj1 = new ResponseTripDto(domainObj.Id.Value, pathId, lineId, Lpassings);



            var mapper = new Mock<ITripMapper>();
            mapper.SetupSequence(o => o.MapFromRegisterTripDtoToDomain(It.IsAny<RegisterTripsDto>()))
               .Returns(domainObj)
               .Returns(anotherDomainObj);
            mapper.SetupSequence(o => o.MapFromDomain2Dto(It.IsAny<Trip>()))
               .Returns(outputObj)
               .Returns(outputObj1);



            //Run the service
            var serv = new RegisterTripService(httpClientFactoryMock.Object, unitOfWork.Object, tripRepo.Object, mapper.Object);

            var res = await serv.AddAsync("Bearer 215418152", inputObj);

            //Checks if the action was completed successfully

            ////Chcks if the value of the task is correct
            Assert.Equal(inputObj.PathId, res[0].PathId);
            Assert.Equal(inputObj.LineId, res[0].LineId);
            Assert.Equal(inputObj.StartingTime, res[0].PassingTimes[0]);
            Assert.Equal(inputObj.StartingTime + 3, res[0].PassingTimes[0] + 3);

        }

        [Fact]
        public async void ShouldRegisterTripsGoAndReturn_NormalSituation1()
        {
            List<int> passing = new List<int>();
            passing.Add(50);
            passing.Add(55);
            string pathId = "pathId";
            string lineId = "lineId";
            List<PassingTime> Lpassings = new List<PassingTime>();
            Lpassings.Add(new PassingTime(50));
            Lpassings.Add(new PassingTime(55));
            //Obtain the domain objects
            Trip domainObj = new Trip(pathId, lineId, passing);
            RegisterTripsDto inputObj = new RegisterTripsDto(pathId, lineId, 50, 56, 10);
            ResponseTripDto outputObj = new ResponseTripDto(domainObj.Id.Value, pathId, lineId, Lpassings);

            //Mock dependencies
            var unitOfWork = new Mock<IUnitOfWork>();
            unitOfWork.Setup(o => o.CommitAsync())
                .Returns(Task.FromResult(200));

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
                    Content = new StringContent("{\"key\":\"lineId\", \"paths\":[{\"key\":\"pathId\",\"line\":\"lineId\",\"type\":\"Go\",\"pathSegments\":[{ \"node1\":\"nodeTest1\", \"node2\":\"nodeTest2\", \"duration\":5, \"distance\":200 }]},{\"key\":\"pathId2\",\"line\":\"lineId\",\"type\":\"Return\",\"pathSegments\":[{ \"node1\":\"nodeTest2\", \"node2\":\"nodeTest1\", \"duration\":5, \"distance\":200 }]}]}")
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
            passing[0] = 55;
            passing[1] = 60;
            Trip anotherDomainObj = new Trip("pathId2", lineId, passing);

            var tripRepo = new Mock<ITripRepository>();
            tripRepo.Setup(o => o.GetListTripsFromPathByTime("pathId", "lineId", 50))
                .Returns(Task.FromResult(new List<Trip>()));
            tripRepo.Setup(o => o.GetListTripsFromPathByTime("pathId2", "lineId", 55))
                .Returns(Task.FromResult(new List<Trip>()));
            tripRepo.SetupSequence(o => o.AddAsync(It.IsAny<Trip>()))
                .Returns(Task.FromResult(domainObj))
                .Returns(Task.FromResult(anotherDomainObj));


            Lpassings[0] = new PassingTime(55);
            Lpassings[1] = new PassingTime(60);
            ResponseTripDto outputObj1 = new ResponseTripDto(anotherDomainObj.Id.Value, "pathId2", "lineId", Lpassings);



            var mapper = new Mock<ITripMapper>();
            mapper.SetupSequence(o => o.MapFromRegisterTripDtoToDomain(It.IsAny<RegisterTripsDto>()))
               .Returns(domainObj)
               .Returns(anotherDomainObj);
            mapper.SetupSequence(o => o.MapFromDomain2Dto(It.IsAny<Trip>()))
               .Returns(outputObj)
               .Returns(outputObj1);



            //Run the service
            var serv = new RegisterTripService(httpClientFactoryMock.Object, unitOfWork.Object, tripRepo.Object, mapper.Object);

            var res = await serv.AddAsync("Bearer 215418152", inputObj);

            //Checks if the action was completed successfully

            ////Chcks if the value of the task is correct
            Assert.Equal(inputObj.PathId, res[0].PathId);
            Assert.Equal(inputObj.LineId, res[0].LineId);
            Assert.Equal("pathId2", res[1].PathId);
            Assert.Equal(inputObj.StartingTime, res[0].PassingTimes[0]);
            Assert.Equal(inputObj.StartingTime + 5, res[1].PassingTimes[0]);
            Assert.Equal(inputObj.StartingTime + 10, res[1].PassingTimes[1]);

        }
    }
}
