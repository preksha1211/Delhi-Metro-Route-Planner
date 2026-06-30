const mongoose = require("mongoose");

const connectionSchema = new mongoose.Schema({
    from: {
        type: String,
        required: true,
    },
    to: {
        type: String,
        required: true,
    },
    line: {
        type: String,
        required: true,
    },
    time: {
        type: Number,
        required: true,
    },
    fare: {
        type: Number,
        required: true,
    },
});

module.exports = mongoose.model("Connection", connectionSchema);