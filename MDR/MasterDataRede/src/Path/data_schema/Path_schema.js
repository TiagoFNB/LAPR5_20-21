var mongoose = require('mongoose');
var PathDomain = require('../domain/Path');
const { PathType } = require('../interfaces/PathType');
// const { PathSegment } = require('../domain/PathSegment');

var Schema = mongoose.Schema;

var PathSchema = new Schema({
    key: {
        type: String,
        required: true,
        min: 1,
        unique: true,
        private: true
    },

    line:{
        type: String,
        required: true
    },

    type:{
        type: PathType,
        required: true
    },

    pathSegments: 
    [
        // {
            PathSegment= {
                _id: false,
                node1: {
                    type: String,
                    // type: mongoose.Schema.Types.ObjectId, ref : 'Node',
                    required: true,
                    // private: true
                },
                node2: {
                    type: String,
                    // type: mongoose.Schema.Types.ObjectId, ref : 'Node',
                    required: true,
                    // private: true
                },
                duration: {
                    type: Number,
                    required: true,
                    // min: 1,
                    // private: true
                },
                distance: {
                    type: Number,
                    required: true,
                    // min: 1,
                    // private: true
                }
            }
        // }
    ]
    ,
    isEmpty: {
        type: Boolean,
        required: true,
        private: true
    }


});




module.exports = mongoose.model('Path', PathSchema);
