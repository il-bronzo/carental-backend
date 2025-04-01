const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking.model");
const Car = require("../models/Car.model")
const {validateDates, validateDrivingLicense, checkBookingConflicts} = require ("../middleware/bookingValidation.js");

router.post("/", validateDates, validateDrivingLicense, checkBookingConflicts, (req, res, next) => {
    const {startDate, endDate, drivingLicense, drivingLicenseExpiration, car, user} = req.body;

    Car.findById(car)
    .then((foundCar) => {
        if(!foundCar) {
            return res.status(404).json({message: "Car not found"});
        }
    return Booking.create({
        startDate, endDate, drivingLicense, drivingLicenseExpiration, car, user: user || null 
    }) //for now there is no user, this wil be removed once JWT implemneted
    })
    
    .then(newBooking => res.status(201).json(newBooking))
    .catch((err) => {
        console.error("Error while creating the booking ->", err);
        next(err);
    })
})

module.exports = router;