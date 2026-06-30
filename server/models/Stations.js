const mongoose = require("mongoose");

const stationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    line: {
        type: String,
        required: true,
    },
});

stationSchema.index({ name: 1, line: 1 }, { unique: true });

module.exports = mongoose.model("Station", stationSchema);