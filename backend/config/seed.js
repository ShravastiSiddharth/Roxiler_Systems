const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios'); 
const connectDB = require('./db');
require('dotenv').config();


const Product = require('../models/Product');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

const seedDatabase = async () => {
  try {
   
    const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
    const products = response.data;

   
    await Product.insertMany(products);
    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding the database:', error);
  }
};


connectDB()
  .then(async () => {
  
    await seedDatabase();

   
  })
  .catch(err => console.error(err));
