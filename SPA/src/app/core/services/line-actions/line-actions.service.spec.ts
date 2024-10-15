import {HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { of } from 'rxjs/internal/observable/of';
import { LineInterface } from 'src/app/shared/models/Line/ILine';
import { Line } from 'src/app/shared/models/Line/Line';
import { LineActionsService } from './line-actions.service';

let httpClientSpy : {post : jasmine.Spy, get: jasmine.Spy};
let Lservice: LineActionsService;
let lineMock : {create : jasmine.Spy};

describe('LineActionsService', () => {

  beforeEach(() => {
    // TODO: spy on other methods too
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['post','get']);
    Lservice = new LineActionsService(httpClientSpy as any);
    lineMock = jasmine.createSpyObj(Line,['create']);
  });

  it('should be created', () => {
    expect(Lservice).toBeTruthy();
  });

  it('Should create Line using http request', () => {
    const expectedL: LineInterface =
    { key:'A', name: 'A', RGB:{red:0,green:0,blue:0} , terminalNode1: 'A', terminalNode2: 'A', AllowedDrivers:[], AllowedVehicles:[]};

    httpClientSpy.post.and.returnValue(of(expectedL));
    lineMock.create.and.returnValue(of(""));

    Lservice.registerLine(expectedL).subscribe(
      line => expect(line).toEqual(expectedL, 'expected line'),
      fail
    );
  });

    it('should return an error when the server returns a 404', () => {
      const inputInterface: LineInterface =
    { key:'A', name: 'A', RGB:{red:0,green:0,blue:0} , terminalNode1: 'A', terminalNode2: 'A', AllowedDrivers:[], AllowedVehicles:[]};



      const expectedResponse = new HttpErrorResponse({
        error: 'test 404 error',
        status: 404, statusText: 'Not Found'
      });

      httpClientSpy.post.and.returnValue(throwError(expectedResponse));
      lineMock.create.and.returnValue(of(""));

      Lservice.registerLine(inputInterface).subscribe(
        vts => fail('expected an error, not a line'),
        error => {expect(error.message).toContain('test 404 error')}
      );


    });

    it('should return a custom error when the server returns a duplicate error message', () => {
      const inputInterface: LineInterface =
    { key:'A', name: 'A', RGB:{red:0,green:0,blue:0} , terminalNode1: 'A', terminalNode2: 'A', AllowedDrivers:[], AllowedVehicles:[]};



      const expectedResponse = new HttpErrorResponse({
        error: 'E11000 duplicate',
        status: 404, statusText: 'Not Found'
      });

      httpClientSpy.post.and.returnValue(throwError(expectedResponse));
      lineMock.create.and.returnValue(of(""));

      Lservice.registerLine(inputInterface).subscribe(
        vts => fail('expected an error, not a line'),
        error => {expect(error.message).toContain('Submitted line code already exists.')}
      );


    });

    it('should return a custom error when the server returns a non alphanumeric code error', () => {
      const inputInterface: LineInterface =
    { key:'A', name: 'A', RGB:{red:0,green:0,blue:0} , terminalNode1: 'A', terminalNode2: 'A', AllowedDrivers:[], AllowedVehicles:[]};



      const expectedResponse = new HttpErrorResponse({
        error: 'child "code" fails because ["code" must only contain alpha-numeric characters]',
        status: 404, statusText: 'Not Found'
      });

      httpClientSpy.post.and.returnValue(throwError(expectedResponse));
      lineMock.create.and.returnValue(of(""));

      Lservice.registerLine(inputInterface).subscribe(
        vts => fail('expected an error, not a line'),
        error => {expect(error.message).toContain('Code must only contain alpha-numeric characters.')}
      );


    });

    it('should obtain lines', () => {

      httpClientSpy.get.and.returnValue(of([" "," "]));

      Lservice.getListLines().subscribe(
        data => {expect(data.length).toBe(2);}
      );


    });

  });
