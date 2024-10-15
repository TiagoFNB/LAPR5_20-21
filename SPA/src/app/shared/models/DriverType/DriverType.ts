import { DriverTypeInterface } from './DriverTypeInterface';

export class DriverType {
	name: string;
	description: string;

	private constructor(name:string,description:string){
		this.name=name;
		this.description=description;
	}

	public static create(object){
		this.validate(object);
		return new DriverType(object.name,object.description);

	}

	private static validate(object: DriverTypeInterface) {
		
		//name validation
		if (object.name) {
			if (object.name.length > 20 ) {
				throw new Error('Name is too long');
			}
		} else {
			throw new Error('Name is required');
		}

		//description validation
		if (object.description) {
			if (object.description.length > 250 ) {
				throw new Error('Description is too long');
			}
		} else {
			throw new Error('Description is required');
		}


	}


}


