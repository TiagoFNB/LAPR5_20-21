import { Path } from '../../../../Path/domain/Path';
import { PathType } from '../../../../Path/interfaces/PathType';
import {Node_ShortName} from '../../../../Node/domain/Node_ShortName'

describe('Create Path domain test', () => {
    test('New Path object should be created with all possible atributes (success case 1)', async () => {
        
        let dto = {
            key: "path1",
            line: "line1",
            type: PathType.Go,
            pathSegments: [
              {
                node1:"lab1",
                node2:"lab2",
                duration: 50,
                distance: 100
              }
            ],
            isEmpty:true
        };

        let result: Path;
        await Path.create(dto).then(res => result = res);

        //Assertions
        expect(result).toBeInstanceOf(Path);

    });

    test('New line object should not be created with empty key  (failure case 1)', async () => {
        
        let dto = {
            key: "",
            line: "line1",
            type: PathType.Go,
            pathSegments: [
              {
                node1:"lab1",
                node2:"lab2",
                duration: 50,
                distance: 100
              }
            ],
            isEmpty:true
        };
        let result;
        await Path.create(dto).catch(res => result = res);

        //Assertions
        expect(result).toBeInstanceOf(Error);

    });

    test('New line object should not be created with empty line (failure case 2)', async () => {
        
        let dto = {
            key: "path1",
            line: "",
            type: PathType.Go,
            pathSegments: [
              {
                node1:"lab1",
                node2:"lab2",
                duration: 50,
                distance: 100
              }
            ],
            isEmpty:true
        };
        let result;
        await Path.create(dto).catch(res => result = res);

        //Assertions
        expect(result).toBeInstanceOf(Error);

    });


});