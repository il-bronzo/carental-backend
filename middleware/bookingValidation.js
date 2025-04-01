const Booking = require ("../models/Booking.model.js");

function validateDates(req, res, next) {
    const { startDate, endDate} = req.body;

    if(new Date(startDate) >= new Date(endDate)) {
      return res.status(400).json({message: "End date must be after start date"});
    }
    next();
}

function validateDrivingLicense (req, res, next) {
    const {drivingLicenseExpiration, endDate } = req.body;

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
        } else { 
            Booking.findOne({
                car, 
                startDate: {$lte: endDate}, 
                endDate: {$gte: startDate}
            })
            .then(carConflict => {
                if(carConflict) {
                    return res.status(400).json({message: "The care is already reserved for this period!"})
                } else {
                    next();
                }
            });
        } 
    })
    .catch((err) => {
        next(err);
    })
}

module.exports = {validateDates, validateDrivingLicense, checkBookingConflicts};
