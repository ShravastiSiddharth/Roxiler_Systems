const express = require('express');
const mongoose = require('mongoose');
const connectDB = require('./config/db')
const cors = require('cors');
require('dotenv').config();
const transactionRoutes = require('./route/transactionRoute');


const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/api', transactionRoutes);

connectDB()
.then(() => app.listen(PORT, () => console.log(`Server running on port ${PORT}`)))
.catch(err => console.error(err));






