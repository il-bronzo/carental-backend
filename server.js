const express = require("express");
const app = express();
require("dotenv").config();
require("./config/db");
require("./config")(app);


const PORT = process.env.PORT || 5005;

app.get("/", (req, res) => {
    res.send("Server is ready")
})

app.listen(PORT, () => console.log(`Listening on port http://localhost:${PORT}`))
