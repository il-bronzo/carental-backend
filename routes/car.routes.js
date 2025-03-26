const express = require("express");
const router = express.Router();
const Car = require("../models/Car.model");

router.get("/", (req, res, next) => {
    Car.find()
    .then((cars) => res.status(200).json(cars))
    .catch((err) => { 
        console.error("Error while getting the cars ->", err);
        next(err);
    })
});

router.get("/:id", (req, res, next) => {
    const { id } = req.params;
    Car.findById(id)
    .then(car => {
        if (!car) return res.status(404).json({ message: "Auto non trovata" });
      res.json(car);
    })
    .catch((err) => {
        console.error("Error while getting the car ->", err);
        next(err);
    })
})
//THIS ONE ONLY FOR ADMINS
router.post("/", (req, res, next) => {
    Car.create(req.body)
    .then(newCar => {
        res.status(201).json(newCar)})
    .catch(err => { 
        console.error("Error while creating the car ->", err);
        next(err);
    })
})

module.exports = router;