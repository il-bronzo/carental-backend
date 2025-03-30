const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking.model");

router.post("/", (req, res, next) => {
    const {startDate, endDate, drivingLicense, car, user} = req.body;

    Booking.create({startDate, endDate, drivingLicense, car, user: user || null //for now there is no user, this wil be removed once JWT implemneted
    })
    .then(newBooking => { console.log("🚨 Prenotazione creata:", newBooking);
        res.status(201).json(newBooking)})
    .catch((err) => {
        console.error("Error while creating the booking ->", err);
        next(err);
    })
});

module.exports = router;