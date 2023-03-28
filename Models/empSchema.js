var mongoose = require('mongoose');
const empSchema = mongoose.Schema({

    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
     location: {
        type: String,
        required: true
    },
    token: {
        type: String
    },
    role: {
        type: String,
        required: true,
        default: "emp",
        enum: ["emp", "manager"]
    },
    CL: {
        type: Number,
        required: true,
        default: 1
    },
    SL: {
        type: Number,
        required: true,
        default: 1
    },
    EL: {
        type: Number,
        required: true,
        default: 1
    }
});
var Emp = mongoose.model('EmpTbl', empSchema);
empSchema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
});
module.exports = Emp;
