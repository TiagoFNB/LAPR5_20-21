import { LineInterface } from 'src/app/shared/models/Line/ILine';
import { Line } from './Line';

describe('Line', () => {

  it('Should create Line', () => {
    const input: LineInterface =
    { key:'A', name: 'B', RGB:{red:0,green:0,blue:0} , terminalNode1: 'A', terminalNode2: 'A', AllowedDrivers:[], AllowedVehicles:[]};

    let result = Line.create(input);
    expect(result).toBeTruthy();
    expect(result.key).toEqual("A");
    expect(result.name).toEqual("B");
    expect(result.RGB.red).toEqual(0);
    expect(result.RGB.green).toEqual(0);
    expect(result.RGB.blue).toEqual(0);
    expect(result.terminalNode1).toEqual("A");
    expect(result.terminalNode2).toEqual("A");
    expect(result.AllowedDrivers).toEqual([]);
    expect(result.AllowedVehicles).toEqual([]);
  });

  it('Should create Line', () => {
    const input: LineInterface =
    { key:'A', name: 'B', RGB:{red:0,green:0,blue:0} , terminalNode1: 'A', terminalNode2: 'A', AllowedDrivers:[], AllowedVehicles:[]};

    let result = Line.create(input);
    expect(result).toBeTruthy();
    expect(result.key).toEqual("A");
    expect(result.name).toEqual("B");
    expect(result.RGB.red).toEqual(0);
    expect(result.RGB.green).toEqual(0);
    expect(result.RGB.blue).toEqual(0);
    expect(result.terminalNode1).toEqual("A");
    expect(result.terminalNode2).toEqual("A");
    expect(result.AllowedDrivers).toEqual([]);
    expect(result.AllowedVehicles).toEqual([]);
  });

  it('Should not create Line : A property is missing', () => {
    const input: LineInterface =
    { key:'A', name: undefined, RGB:{red:0,green:0,blue:0} , terminalNode1: 'A', terminalNode2: 'A', AllowedDrivers:[], AllowedVehicles:[]};
    

    let result; 
    try{
        result = Line.create(input);
        fail;
    }catch(err){
        expect(err.message).toEqual("One of the fields was not filled.");
    }

  });

  it('Should not create Line : Color format is invalid', () => {
    const input: LineInterface =
    { key:'A', name: 'A', RGB:{red:0,green:256,blue:0} , terminalNode1: 'A', terminalNode2: 'A', AllowedDrivers:[], AllowedVehicles:[]};
    

    let result; 
    try{
        result = Line.create(input);
        fail;
    }catch(err){
        expect(err.message).toEqual("The Color format is incorrect.");
    }

  });
   
});
