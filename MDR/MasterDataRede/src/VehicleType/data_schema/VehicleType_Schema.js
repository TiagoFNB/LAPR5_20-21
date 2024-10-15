var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var VehicleTypeSchema = new Schema({
	key: {
		type: String,
		required: false,
		min: 1,
		unique: true,
		private: true,
		sparse: true
	},
	name: {
		type: String,
		required: true,
		minlength: 2,
		maxlength: 20,
		unique: true,
		private: true
	},

	description: {
		type: String,
		required: false,
		minlength: 3,
		maxlength: 250,
		private: true
	},

	fuelType: {
		type: String,
		required: true,
		private: true
	},
	autonomy: {
		type: Number,
		min: 0.01,
		required: true,
		private: true
	},
	costPerKm: {
		type: Number, // price  + currency
		min: 0.01,
		required: true,
		private: true
	},
	currency: {
		type: String, // price  + currency
		required: true,
		private: true
	},

	averageConsumption: {
		type: Number, // String becouse it has a 'consumption value  + unity'
		min: 0.01,
		required: true,
		private: true
	},
	averageConsumption_unit: {
		type: String, // String becouse it has a 'consumption value  + unity'
		required: true,
		private: true
	},
	averageSpeed: {
		type: Number,
		min: 0.01,
		required: true,
		private: true
	}
});

module.exports = mongoose.model('VehicleType', VehicleTypeSchema);
