const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking.model");
const User = require("../models/User.model")
const Car = require("../models/Car.model")
const {validateDates, validateDrivingLicense, checkBookingConflicts} = require ("../middleware/bookingValidation.js");
const {isAuthenticated} = require("../middleware/jwt.middleware");

router.post("/", isAuthenticated, validateDates, validateDrivingLicense, checkBookingConflicts, (req, res, next) => {
    const {startDate, endDate, drivingLicense, drivingLicenseExpiration, car} = req.body;
    const userId = req.payload._id;

    User.findById(userId)
    .then((foundUser) => {
        if(!foundUser) {
            return res.status(404).json({message : "User not found"})
        } else if (foundUser.drivingLicense !==drivingLicense) {
            return res.status(403).json({ message: "Invalid driving license number!" });
        } else {
            return Car.findById(car)
            .then((foundCar) => {
            if(!foundCar) {
                return res.status(404).json({message: "Car not found"});
            } else {
                return Booking.create({startDate, endDate, drivingLicense, drivingLicenseExpiration, car, user: userId})
            }
            })
            .then(newBooking => res.status(201).json(newBooking))
        }
    })
    .catch((err) => {
        console.error("Error while creating the booking ->", err);
        next(err);
    
    })
})

module.exports = router;