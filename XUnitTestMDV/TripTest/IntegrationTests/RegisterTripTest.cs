using DDDSample1.Domain.Shared;
using Microsoft.AspNetCore.Mvc;
using Moq;
using System;
using System.Threading.Tasks;
using DDDNetCore.Trips.Domain;
using Xunit;
using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading;
using DDDNetCore.DriverDuties.Controllers;
using DDDNetCore.DriverDuties.Domain;
using DDDNetCore.DriverDuties.Dto;
using DDDNetCore.DriverDuties.Mappers;
using DDDNetCore.DriverDuties.Repository;
using DDDNetCore.DriverDuties.Services;
using DDDNetCore.Drivers.Domain;
using DDDNetCore.Drivers.Domain.ValueObjects;
using DDDNetCore.Drivers.Repository;
using DDDNetCore.Trips.Controllers;
using DDDNetCore.Trips.Domain.ValueObjects;
using DDDNetCore.Trips.DTO;
using DDDNetCore.Trips.Repository;
using DDDNetCore.Trips.Services;
using DDDSample1.Infrastructure;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Razor.TagHelpers;
using Moq.Protected;

namespace XUnitTestMDV.TripTest.IntegrationTests
{
    public class RegisterTripTest
    {
        [Fact]
        public async void ShouldRegisterTrip()
        {
            List<int> passing = new List<int>();
            passing.Add(50);
            passing.Add(55);
            string pathId = "pathId";
            string lineId = "lineId";

            //Obtain the domain objects
            Trip domainObj = new Trip(pathId, lineId, passing);
            RegisterTripsDto inputObj = new RegisterTripsDto(pathId, lineId, 50, 55, 10);

            ResponseTripDto expResult;
            //Mock dependencies
            var unitOfWork = new Mock<IUnitOfWork>();
            unitOfWork.Setup(o => o.CommitAsync())
                .Returns(Task.FromResult(200));

            var mapper = new TripMapper();

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


            //Use real http client with mocked handler here
            var httpClient = new HttpClient(mockHttpMessageHandler.Object)
            {
                BaseAddress = new Uri("http://test.com"),
            };

            var HttpClientFactoryMock = new Mock<IHttpClientFactory>();

            //setup the method call
            HttpClientFactoryMock.Setup(x => x.CreateClient(It.IsAny<String>())).Returns(httpClient);


            var tripRepo = new Mock<ITripRepository>();
            tripRepo.Setup(o => o.GetListTripsFromPathByTime("pathId", "lineId", 50))
                .Returns(Task.FromResult(new List<Trip>()));
            tripRepo.SetupSequence(o => o.AddAsync(It.IsAny<Trip>()))
            .Returns(Task.FromResult(domainObj));


            //Run the test
            RegisterTripService serv = new RegisterTripService(HttpClientFactoryMock.Object, unitOfWork.Object,
                tripRepo.Object, mapper);
            var httpContext = new DefaultHttpContext();
            httpContext.Request.Headers["Authorization"] = "test1 test";

            RegisterTripController cntr = new RegisterTripController(serv)
            {
                ControllerContext = new ControllerContext()
                {
                    HttpContext = httpContext
                }
            };



            var result = cntr.Register(inputObj);

            //Checks if the action was completed successfully
            Assert.IsType<OkObjectResult>(result.Result);

            OkObjectResult okRes = (OkObjectResult)result.Result;
            List<ResponseTripDto> res = (List<ResponseTripDto>)okRes.Value;

            ////Chcks if the value of the task is correct
            Assert.Equal(inputObj.PathId, res[0].PathId);
            Assert.Equal(inputObj.LineId, res[0].LineId);
            Assert.Equal(inputObj.StartingTime, res[0].PassingTimes[0]);
        }

        [Fact]
        public async void ShouldRegister2TripWithFrequency()
        {
            List<int> passing = new List<int>();
            passing.Add(50);
            passing.Add(55);
            string pathId = "pathId";
            string lineId = "lineId";

            //Obtain the domain objects
            Trip domainObj = new Trip(pathId, lineId, passing);
            RegisterTripsDto inputObj = new RegisterTripsDto(pathId, lineId, 50, 55, 3);

            ResponseTripDto expResult;
            //Mock dependencies
            var unitOfWork = new Mock<IUnitOfWork>();
            unitOfWork.Setup(o => o.CommitAsync())
                .Returns(Task.FromResult(200));

            var mapper = new TripMapper();

            //Mock the handler
            var moctHttpMessageHandler = new Mock<HttpMessageHandler>();

            //Setup protected method on httpmessagehandler mock
            moctHttpMessageHandler.Protected()
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


            //Use real http client with mocked handler here
            var httpClient = new HttpClient(moctHttpMessageHandler.Object)
            {
                BaseAddress = new Uri("http://test.com"),
            };

            var HttpClientFactoryMock = new Mock<IHttpClientFactory>();

            //setup the method call
            HttpClientFactoryMock.Setup(x => x.CreateClient(It.IsAny<String>())).Returns(httpClient);
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

            //Run the test
            RegisterTripService serv = new RegisterTripService(HttpClientFactoryMock.Object, unitOfWork.Object,
                tripRepo.Object, mapper);
            var httpContext = new DefaultHttpContext();
            httpContext.Request.Headers["Authorization"] = "test1 test";

            RegisterTripController cntr = new RegisterTripController(serv)
            {
                ControllerContext = new ControllerContext()
                {
                    HttpContext = httpContext
                }
            };



            var result = cntr.Register(inputObj);

            //Checks if the action was completed successfully
            Assert.IsType<OkObjectResult>(result.Result);

            OkObjectResult okRes = (OkObjectResult)result.Result;
            List<ResponseTripDto> res = (List<ResponseTripDto>)okRes.Value;

            ////Chcks if the value of the task is correct
            Assert.Equal(inputObj.PathId, res[0].PathId);
            Assert.Equal(inputObj.LineId, res[0].LineId);
            Assert.Equal(inputObj.StartingTime, res[0].PassingTimes[0]);
            Assert.Equal(inputObj.StartingTime + 3, res[0].PassingTimes[0] + 3);
        }

        [Fact]
        public async void ShouldRegister2TripThatAreGoAndReturnWithoutFrequency()
        {
            List<int> passing = new List<int>();
            passing.Add(50);
            passing.Add(55);
            string pathId = "pathId";
            string lineId = "lineId";

            //Obtain the domain objects
            Trip domainObj = new Trip(pathId, lineId, passing);
            RegisterTripsDto inputObj = new RegisterTripsDto(pathId, lineId, 50, 60, 10);

            ResponseTripDto expResult;
            //Mock dependencies
            var unitOfWork = new Mock<IUnitOfWork>();
            unitOfWork.Setup(o => o.CommitAsync())
                .Returns(Task.FromResult(200));

            var mapper = new TripMapper();

            //Mock the handler
            var moctHttpMessageHandler = new Mock<HttpMessageHandler>();

            //Setup protected method on httpmessagehandler mock
            moctHttpMessageHandler.Protected()
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


            //Use real http client with mocked handler here
            var httpClient = new HttpClient(moctHttpMessageHandler.Object)
            {
                BaseAddress = new Uri("http://test.com"),
            };

            var HttpClientFactoryMock = new Mock<IHttpClientFactory>();

            //setup the method call
            HttpClientFactoryMock.Setup(x => x.CreateClient(It.IsAny<String>())).Returns(httpClient);
            Trip anotherDomainObj = domainObj;
            anotherDomainObj.PassingTimes[0] = new PassingTime(55);
            anotherDomainObj.PassingTimes[1] = new PassingTime(60);

            var tripRepo = new Mock<ITripRepository>();
            tripRepo.Setup(o => o.GetListTripsFromPathByTime("pathId", "lineId", 50))
                .Returns(Task.FromResult(new List<Trip>()));
            tripRepo.Setup(o => o.GetListTripsFromPathByTime("pathId2", "lineId", 55))
                .Returns(Task.FromResult(new List<Trip>()));
            tripRepo.SetupSequence(o => o.AddAsync(It.IsAny<Trip>()))
            .Returns(Task.FromResult(domainObj))
            .Returns(Task.FromResult(anotherDomainObj));

            //Run the test
            RegisterTripService serv = new RegisterTripService(HttpClientFactoryMock.Object, unitOfWork.Object,
                tripRepo.Object, mapper);
            var httpContext = new DefaultHttpContext();
            httpContext.Request.Headers["Authorization"] = "test1 test";

            RegisterTripController cntr = new RegisterTripController(serv)
            {
                ControllerContext = new ControllerContext()
                {
                    HttpContext = httpContext
                }
            };



            var result = await cntr.Register(inputObj);

            //Checks if the action was completed successfully
            Assert.IsType<OkObjectResult>(result);

            OkObjectResult okRes = (OkObjectResult)result;
            List<ResponseTripDto> res = (List<ResponseTripDto>)okRes.Value;

            ////Chcks if the value of the task is correct
            Assert.Equal(inputObj.PathId, res[0].PathId);
            Assert.Equal(inputObj.LineId, res[0].LineId);
            Assert.Equal("pathId2", res[1].PathId);
            Assert.Equal(inputObj.StartingTime, res[0].PassingTimes[0]);
            Assert.Equal(inputObj.StartingTime + 5, res[1].PassingTimes[0]);
            Assert.Equal(inputObj.StartingTime + 10, res[1].PassingTimes[1]);
        }

        [Fact]
        public async void ShouldNotRegisterTripWithSameStartFromSameLineAndPath()
        {
            List<int> passing = new List<int>();
            passing.Add(50);
            passing.Add(55);
            string pathId = "pathId";
            string lineId = "lineId";

            //Obtain the domain objects
            Trip domainObj = new Trip(pathId, lineId, passing);
            RegisterTripsDto inputObj = new RegisterTripsDto(pathId, lineId, 50, 0, 0);

            ResponseTripDto expResult;
            //Mock dependencies
            var unitOfWork = new Mock<IUnitOfWork>();
            unitOfWork.Setup(o => o.CommitAsync())
                .Returns(Task.FromResult(200));

            var mapper = new TripMapper();

            //Mock the handler
            var moctHttpMessageHandler = new Mock<HttpMessageHandler>();

            //Setup protected method on httpmessagehandler mock
            moctHttpMessageHandler.Protected()
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


            //Use real http client with mocked handler here
            var httpClient = new HttpClient(moctHttpMessageHandler.Object)
            {
                BaseAddress = new Uri("http://test.com"),
            };

            var HttpClientFactoryMock = new Mock<IHttpClientFactory>();

            //setup the method call
            HttpClientFactoryMock.Setup(x => x.CreateClient(It.IsAny<String>())).Returns(httpClient);
            List<Trip> listAlreadyInRepo = new List<Trip>();
            listAlreadyInRepo.Add(domainObj);

            var tripRepo = new Mock<ITripRepository>();
            tripRepo.Setup(o => o.GetListTripsFromPathByTime("pathId", "lineId", 50))
                .Returns(Task.FromResult(listAlreadyInRepo));

            //Run the test
            RegisterTripService serv = new RegisterTripService(HttpClientFactoryMock.Object, unitOfWork.Object,
                tripRepo.Object, mapper);
            var httpContext = new DefaultHttpContext();
            httpContext.Request.Headers["Authorization"] = "test1 test";

            RegisterTripController cntr = new RegisterTripController(serv)
            {
                ControllerContext = new ControllerContext()
                {
                    HttpContext = httpContext
                }
            };



            var result = await cntr.Register(inputObj);

            //Checks if the action was completed successfully
            Assert.IsType<OkObjectResult>(result);

            OkObjectResult okRes = (OkObjectResult)result;
            List<ResponseTripDto> res = (List<ResponseTripDto>)okRes.Value;

            ////Chcks if the value of the task is correct
            Assert.Empty(res);
        }

        [Fact]
        public async void ShouldNotRegisterTripWithPathThatNotBelongToLine()
        {
            List<int> passing = new List<int>();
            passing.Add(50);
            passing.Add(55);
            string pathId = "pathId";
            string lineId = "lineId";

            //Obtain the domain objects
            Trip domainObj = new Trip(pathId, lineId, passing);
            RegisterTripsDto inputObj = new RegisterTripsDto(pathId, lineId, 50, 0, 0);

            ResponseTripDto expResult;
            //Mock dependencies
            var unitOfWork = new Mock<IUnitOfWork>();
            unitOfWork.Setup(o => o.CommitAsync())
                .Returns(Task.FromResult(200));

            var mapper = new TripMapper();

            //Mock the handler
            var moctHttpMessageHandler = new Mock<HttpMessageHandler>();

            //Setup protected method on httpmessagehandler mock
            moctHttpMessageHandler.Protected()
                .Setup<Task<HttpResponseMessage>>("SendAsync",
                    ItExpr.IsAny<HttpRequestMessage>(),
                    ItExpr.IsAny<CancellationToken>()
                )
                .ReturnsAsync(new HttpResponseMessage()
                {
                    StatusCode = HttpStatusCode.OK,
                    Content = new StringContent(
                        "{\"key\":\"pathId\",\"line\":\"lineId2\",\"type\":\"Go\",\"pathSegments\":[{ \"node1\":\"nodeTest1\", \"node2\":\"nodeTest2\", \"duration\":5, \"distance\":200 }]}")
                });


            //Use real http client with mocked handler here
            var httpClient = new HttpClient(moctHttpMessageHandler.Object)
            {
                BaseAddress = new Uri("http://test.com"),
            };

            var HttpClientFactoryMock = new Mock<IHttpClientFactory>();

            //setup the method call
            HttpClientFactoryMock.Setup(x => x.CreateClient(It.IsAny<String>())).Returns(httpClient);

            var tripRepo = new Mock<ITripRepository>();

            //Run the test
            RegisterTripService serv = new RegisterTripService(HttpClientFactoryMock.Object, unitOfWork.Object,
                tripRepo.Object, mapper);
            var httpContext = new DefaultHttpContext();
            httpContext.Request.Headers["Authorization"] = "test1 test";

            RegisterTripController cntr = new RegisterTripController(serv)
            {
                ControllerContext = new ControllerContext()
                {
                    HttpContext = httpContext
                }
            };

            var result = await cntr.Register(inputObj);

            //Checks if the action was completed successfully
            Assert.IsType<ContentResult>(result);

            ContentResult okRes = (ContentResult)result;
            string res = (string)okRes.Content;

            ////Chcks if the value of the task is correct
            Assert.Equal("The path id indicated does not belong to the line indicated !", res.ToString());
        }

        [Fact]
        public async void ShouldNotRegisterTripBecausePathDoesntExist()
        {
            List<int> passing = new List<int>();
            passing.Add(50);
            passing.Add(55);
            string pathId = "pathId";
            string lineId = "lineId";

            //Obtain the domain objects
            Trip domainObj = new Trip(pathId, lineId, passing);
            RegisterTripsDto inputObj = new RegisterTripsDto(pathId, lineId, 50, 0, 0);

            ResponseTripDto expResult;
            //Mock dependencies
            var unitOfWork = new Mock<IUnitOfWork>();
            unitOfWork.Setup(o => o.CommitAsync())
                .Returns(Task.FromResult(200));

            var mapper = new TripMapper();

            //Mock the handler
            var moctHttpMessageHandler = new Mock<HttpMessageHandler>();

            //Setup protected method on httpmessagehandler mock
            moctHttpMessageHandler.Protected()
                .Setup<Task<HttpResponseMessage>>("SendAsync",
                    ItExpr.IsAny<HttpRequestMessage>(),
                    ItExpr.IsAny<CancellationToken>()
                )
                .ReturnsAsync(new HttpResponseMessage()
                {
                    StatusCode = HttpStatusCode.OK,
                    Content = new StringContent(
                        "ERROR PLS")
                });


            //Use real http client with mocked handler here
            var httpClient = new HttpClient(moctHttpMessageHandler.Object)
            {
                BaseAddress = new Uri("http://test.com"),
            };

            var HttpClientFactoryMock = new Mock<IHttpClientFactory>();

            //setup the method call
            HttpClientFactoryMock.Setup(x => x.CreateClient(It.IsAny<String>())).Returns(httpClient);

            var tripRepo = new Mock<ITripRepository>();

            //Run the test
            RegisterTripService serv = new RegisterTripService(HttpClientFactoryMock.Object, unitOfWork.Object,
                tripRepo.Object, mapper);
            var httpContext = new DefaultHttpContext();
            httpContext.Request.Headers["Authorization"] = "test1 test";

            RegisterTripController cntr = new RegisterTripController(serv)
            {
                ControllerContext = new ControllerContext()
                {
                    HttpContext = httpContext
                }
            };

            var result = await cntr.Register(inputObj);

            //Checks if the action was completed successfully
            Assert.IsType<ContentResult>(result);

            ContentResult okRes = (ContentResult)result;
            string res = (string)okRes.Content;

            ////Chcks if the value of the task is correct
            Assert.Equal("The path id indicated does not exist !", res.ToString());
        }
    }
}
