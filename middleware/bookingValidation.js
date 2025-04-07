const Booking = require ("../models/Booking.model.js");
const Car = require("../models/Car.model");

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
    const { startDate, endDate, car } = req.body;
    const userId = req.payload._id;
  
    Booking.findOne({
      user: userId,
      startDate: {$lte: endDate},
      endDate: {$gte: startDate}
    })
    .then(userConflict => {
      if (userConflict) {
        res.status(400).json({message: "You already have a reservation in this period!"});
      } else {
        Car.findById(car)
          .then(foundCar => {
            if (!foundCar) {
              res.status(404).json({ message: "Car not found!" });
            } else {
              Booking.countDocuments({
                car: foundCar._id,
                startDate: { $lte: endDate },
                endDate: { $gte: startDate }
              })
              .then(count => {
                if (count >= foundCar.stock) {
                  res.status(400).json({message: `No available ${foundCar.brand} ${foundCar.model} cars in this period!`});
                } else {
                  next();
                }
              })
              .catch(err => next(err));
            }
          })
          .catch(err => next(err));
      }
    })
    .catch(err => next(err));
  }

module.exports = {validateDates, validateDrivingLicense, checkBookingConflicts};
