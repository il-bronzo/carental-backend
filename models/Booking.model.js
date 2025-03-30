const {Schema, model} = require("mongoose");

const bookingSchema = new Schema ({
    startDate : {type: Date, required: true},
    endDate: {type:Date, required:true,
        validate:{validator: function(value) {
            return value > this.startDate;
        },
        message: "The end date must be after the start date!"}},
    drivingLicense: {type: String, required: true},
    car: {type: Schema.Types.ObjectId, ref: "Car", required: true},
    user: {type: Schema.Types.ObjectId, ref: "User", required: true}
}, {timestamps: true});

const Booking = model("Booking", bookingSchema);
module.exports = Booking;