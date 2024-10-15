import { of, throwError } from 'rxjs';
import { WorkblockActionsService } from './workblock-actions.service';
import { WorkBlockGeneratorViewDto } from 'src/app/shared/dtos/WorkBlock/WorkBlockGeneratorViewDto';
import { WorkBlockGeneratorInterface } from 'src/app/shared/models/WorkBlock/WorkBlockGenerator/WorkBlockGeneratorInterface';

let httpClientSpy : {get : jasmine.Spy; post: jasmine.Spy };
let WbService:WorkblockActionsService;
let mapperSpy: { FromViewToDomainDto: jasmine.Spy ,FromDomainToMDVDto:jasmine.Spy};

describe('WorkBlockActionsService', () => {
  

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get', 'post']);
    mapperSpy = jasmine.createSpyObj('WorkBlockGeneratorMapperService', [ 'FromViewToDomainDto', 'FromDomainToMDVDto']);
    WbService = new WorkblockActionsService(httpClientSpy as any, mapperSpy as any);
  });

  it('should be created', () => {
    expect(WbService).toBeTruthy();
  });

  it('Should create WorkBlocks using http request', () => {
    let inputDto : WorkBlockGeneratorViewDto = {
      vehicleServiceId: "string",
      time: "string",
      amountBlocks: 1,
      durationBlocks:"string",
      selectedTrips:[]};

    let domainDto : WorkBlockGeneratorInterface = {
      maxBlocks: 2,
      maxDuration : 1,
      dateTime : "string",
      vehicleDuty : "string",
      trips : ["testTrip01"]
    }

    mapperSpy.FromViewToDomainDto.and.returnValue(domainDto);
    mapperSpy.FromDomainToMDVDto.and.returnValue("testToJson");


    const expectedResponse: any[] =
    [{dummyInput:"AAA"}, { dummyInput:"BBB"}];

    httpClientSpy.post.and.returnValue(of(expectedResponse));

    WbService.registerWorkBlocksOfVehicleService(inputDto).subscribe(
      data => expect(data).toEqual(expectedResponse),
      fail
    );
  });

  it('Should create WorkBlocks using http request : error http response', () => {
    let inputDto : WorkBlockGeneratorViewDto = {
      vehicleServiceId: "string",
      time: "string",
      amountBlocks: 1,
      durationBlocks:"string",
      selectedTrips:[]};

    let domainDto : WorkBlockGeneratorInterface = {
      maxBlocks: 2,
      maxDuration : 1,
      dateTime : "string",
      vehicleDuty : "string",
      trips : ["testTrip01"]
    }

    mapperSpy.FromViewToDomainDto.and.returnValue(domainDto);
    mapperSpy.FromDomainToMDVDto.and.returnValue("testToJson");


    const expectedResponse: Error =
    new Error("Error happened.");

    httpClientSpy.post.and.returnValue(throwError(expectedResponse));

    WbService.registerWorkBlocksOfVehicleService(inputDto).subscribe(
      ((data) => {fail}),
      (error) => {expect(error).toEqual(expectedResponse),fail}
    );
  });

});
