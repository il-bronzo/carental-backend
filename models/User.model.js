const {Schema, model} = require("mongoose");

const userSchema = new Schema({
    name: {type: String, required:[true, "Name is required"]},
    email: {type:String, required:[true, "Email is required"], unique: true, trim:true, lowercase: true},
    password: {type: String, required: [true, "Password is required"]},
    role: {type: String, enum: ["user", "admin"], default: "user"}, 
    drivingLicense: {type: String, required:[true, "Driving license is required"]},
    drivingLicenseExpiration: {type:Date, required:[true, "Expiration date is required"]}
}, {timestamps: true})

const User = model("User", userSchema);
module.exports = User;