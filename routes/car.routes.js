const express = require("express");
const router = express.Router();
const Car = require("../models/Car.model");
const { isAuthenticated, isAdmin } = require("../middleware/jwt.middleware");

router.get("/", (req, res, next) => {
  Car.find()
    .then((cars) => res.status(200).json(cars))
    .catch((err) => {
      console.error("Error while getting the cars ->", err);
      next(err);
    });
});

router.get("/:id", (req, res, next) => {
  const { id } = req.params;
  Car.findById(id)
    .then((car) => {
      if (!car) return res.status(404).json({ message: "Car not found!" });
      res.json(car);
    })
    .catch((err) => {
      console.error("Error while getting the car ->", err);
      next(err);
    });
});

router.post("/", isAuthenticated, isAdmin, (req, res, next) => {
  Car.create(req.body)
    .then((newCar) => {
      res.status(201).json(newCar);
    })
    .catch((err) => {
      console.error("Error while creating the car ->", err);
      next(err);
    });
});

router.put("/:id", isAuthenticated, isAdmin, (req, res, next) => {
  const { id } = req.params;
  const { brand, model, stock, peakSeasonPrice, midSeasonPrice } = req.body;
  Car.findByIdAndUpdate(
    id,
    { brand, model, stock, peakSeasonPrice, midSeasonPrice },
    { new: true }
  )
    .then((updatedCar) => {
      if (!updatedCar) {
        return res.status(404).json({ message: "Car not found" });
      }
      res.json(updatedCar);
    })
    .catch((err) => {
      console.error("Error while updating the car ->", err);
      next(err);
    });
});

router.delete("/:id", isAuthenticated, isAdmin, (req, res, next) => {
  const { id } = req.params;
  Car.findByIdAndDelete(id)
    .then((deletedCar) => {
      if (!deletedCar) {
        return res.status(404).json({ message: "Car not found!" });
      }
      res.json({ message: "Car successfully deleted!", deletedCar });
    })
    .catch((err) => {
      console.error("Error while deleting the car ->", err);
      next(err);
    });
});

module.exports = router;
