const mongoose = require("mongoose");
require("dotenv").config();

const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("API is running");
});

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("Error connecting to MongoDB:", err));

app.listen(5000, () => {
    console.log("Server is running on port 5000");
})

const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

const blogRoutes = require("./routes/blog");
app.use("/api/blogs", blogRoutes);