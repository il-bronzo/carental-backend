const express = require("express");
const logger = require("morgan");
const cors = require("cors");

const FRONTEND_URL = process.env.ORIGIN;

//MIDDLEWARE CONFIGURATION
module.exports = (app) => {
app.use(
    cors({
      origin: "*" //to be changed with FRONTEND_URL
    })
);
app.use(logger("dev"));
app.use(express.json());
};