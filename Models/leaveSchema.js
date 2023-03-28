var mongoose = require('mongoose');
const leaveSchema = mongoose.Schema({

    username: {
        type: String,
        required: true
    },
    empid: {
        type: String
    },  
    CL: {
        type: Number, 
        default: 0
    },
    SL: {
        type: Number,
        default: 0
    },
    EL: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        default: "Pending for Approval"
    }
});
var Leave = mongoose.model('LeaveTbl', leaveSchema);

module.exports = Leave;
