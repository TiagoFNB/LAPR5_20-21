var mongoose     = require('mongoose');

var Schema       = mongoose.Schema;


var Line_Schema   = new Schema(  {

    key:{
        type: String,
        required:true,
        minLength:1,
        unique:true,
        private: true
    },
    
  
    name: {
        type: String,
        required:true,
        minLength:1,
        private: true
    },
    
    terminalNode1:{
        type: String,
        required:true,
        minLength:1,
        private: true
    },

    terminalNode2:{
        type: String,
        required:true,
        minLength:1,
        private: true
    },

    RGB:{
        required:false,
        red:{
            type: Number,
            required:true,
            min:0,
            max:255,
            private: true
        },
        green:{
            type: Number,
            required:true,
            min:0,
            max:255,
            private: true
        },
        blue:{
            type: Number,
            required:true,
            min:0,
            max:255,
            private: true
        }
    },

    allowedDrivers:{
        type: [String],
        default: undefined
    },

    allowedVehicles:{
        type: [String],
        default: undefined
    }   

}) 

module.exports = mongoose.model('Line', Line_Schema);