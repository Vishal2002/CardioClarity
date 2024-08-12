const express = require("express");
const mongoose = require("mongoose");
const { config } = require('dotenv');
const cors = require('cors');
require('./scheduledTask');
config();

const routes = require('./route');

const app = express();

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("MongoDB connection error:", err));

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true,
}));
app.use('/api', routes);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server started on port ${port}`));
