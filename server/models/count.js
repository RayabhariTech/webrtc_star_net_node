const mongoose = require("mongoose");

const countSchema = mongoose.Schema({
    count: {
        type: Number,
        default:0
    }
})

const countModel = mongoose.model("count", countSchema);
module.exports = countModel;