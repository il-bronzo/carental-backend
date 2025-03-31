const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking.model");
const Car = require("../models/Car.model")


function validateDates(req, res, next) {
    if(new Date(req.body.startDate) >= new Date(req.body.endDate)) {
      return res.status(400).json({message: "End date must be after start date"});
    }
    next();
  }

function validateDrivingLicense (req, res, next) {
    const {drivingLicenseExpiration } = req.body;
    const {endDate} = req.body;

    if(new Date(drivingLicenseExpiration) < new Date(endDate)) {
        return res.status(400).json({message: "Driving license must be valid during the entire booking period!"})
    }
    next();
}

function checkBookingConflicts(req, res, next) {
    const {startDate, endDate, user, car} = req.body;

    Booking.findOne({
        user, 
        startDate: {$lte: endDate}, 
        endDate: {$gte: startDate}
    })
    .then(userConflict => {
        if(userConflict) {
            return res.status(400).json({message: "You already have a reservation in this period!"});
        }
        return Booking.findOne({
            car, 
            startDate: {$lte: endDate}, 
            endDate: {$gte: startDate}
        });
    })
    .then(carConflict => {
        if(carConflict) {
            return res.status(400).json({message: "The care is already reserved for this period!"})
        }
        next();
    })
    .catch((err) => {
        next(err);
    })
}


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