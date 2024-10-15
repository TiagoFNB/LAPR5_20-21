var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var PathSegmentSchema = new Schema({
    node1: {
        type: String,
        // type: mongoose.Schema.Types.ObjectId, ref : 'Node',
        required: true,
        private: true
    },
    node2: {
        type: String,
        // type: mongoose.Schema.Types.ObjectId, ref : 'Node',
        required: true,
        private: true
    },
    duration: {
        type: Number,
        required: true,
        min: 1,
        private: true
    },
    _distance: {
        type: Number,
        required: true,
        min: 1,
        private: true
    }
});




module.exports = mongoose.model('PathSegment', PathSegmentSchema);