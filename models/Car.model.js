const {Schema, model} = require("mongoose");

const carSchema = new Schema({
    brand: {type: String, required: true},
    model: {type: String, required: true},
    stock: {type: Number, required: true, min: 0},
    peakSeasonPrice: {type: Number, required: true, min: 0},
    midSeasonPrice: {type: Number, required:true, min: 0},
});

const Car = model("Car", carSchema);
module.exports = Car;