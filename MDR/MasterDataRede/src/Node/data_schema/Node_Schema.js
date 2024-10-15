var mongoose = require('mongoose');

import { Node } from '../domain/Node';
var Schema = mongoose.Schema;

var NodeSchema = new Schema({
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
		min: 3,
		private: true
	},

	coordinates: {
		latitude: {
			type: Number,
			required: true,
			max: 90,
			min: -90,
			private: true
		},
		longitude: {
			type: Number,
			required: true,
			max: 180,
			min: -180,
			private: true
		}
	},

	shortName: {
		type: String,
		required: true,
		min: 2,
		max: 45,
		unique: true,
		private: true
	},
	isDepot: {
		type: Boolean,
		required: true,
		private: true
	},
	isReliefPoint: {
		type: Boolean,
		required: true,
		private: true
	},
	crewTravelTimes_duration: {
		type: Number,
		required: false,
		private: true
	},
	crewTravelTimes_node: {
		type: String,
		required: false,
		private: true
	}
});

module.exports = mongoose.model('Node', NodeSchema);
