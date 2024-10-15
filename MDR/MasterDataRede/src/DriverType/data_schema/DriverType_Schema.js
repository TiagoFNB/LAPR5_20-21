
var mongoose     = require('mongoose');
var DriverTypeDomain   =   require('../domain/DriverType');
var Schema = mongoose.Schema;
var DriverTypeSchema = new Schema(
  {
    key:{
        type: String,
        required: false,
        min: 1,
        unique: true,
        private: true,
        sparse: true
    },
    
    name: {
        type: String,
        required:true,
        unique:true,
        min:1,
        max:20,
        private: true
    },

    description: {
        type: String,
        required:true,
        min:3,
        max:250,
        private: true
    }

   
  });

//DriverTypeSchema.loadClass(DriverTypeDomain);


module.exports = mongoose.model('DriverType', DriverTypeSchema);

