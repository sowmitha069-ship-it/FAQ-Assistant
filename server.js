const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const faqRoutes = require("./routes/faqRoutes");

const app = express();


// Middleware
app.use(cors());
app.use(express.json());


// Serve frontend
app.use(express.static(__dirname));


// API routes
app.use("/api/faqs", faqRoutes);


// Start server
const PORT = process.env.PORT || 5000;

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected successfully");
    })
    .catch((error) => {
        console.log("MongoDB connection error:", error);
    });


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});