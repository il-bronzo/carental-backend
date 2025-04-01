const express = require("express");
const app = express();
require("dotenv").config();
require("./config/db");
require("./config")(app);

const PORT = process.env.PORT || 5005;

const carRoutes = require("./routes/car.routes")
app.use("/api/cars", carRoutes)

const bookingRoutes = require("./routes/booking.routes");
app.use("/api/bookings", bookingRoutes)


app.get("/", (req, res) => {
    res.send("Server is ready")
})
app.get("/test-error-500", (req, res, next) => {
    next(new Error("SImulated error!")); 
});

require("./middleware/errorHandler")(app)

app.listen(PORT, () => console.log(`Listening on port http://localhost:${PORT}`))
