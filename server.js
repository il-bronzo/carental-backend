require("dotenv").config();
require("./config/db")

const express = require ('express');
const app = express();
const PORT = process.env.PORT || 5005;

app.get("/", (req, res) => {
    res.send("Server is ready")
})

app.listen(PORT, () => console.log(`Listening on port http://localhost:${PORT}`))
