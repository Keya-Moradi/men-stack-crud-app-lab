const express = require('express');
const app = express();
app.set('view engine', 'ejs');

const port = process.env.PORT || 3000;

const Car = require('./models/car');

const mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Middleware
app.use(express.urlencoded({ extended: true }));
const methodOverride = require('method-override');
app.use(methodOverride('_method'));

// Route to test if server is running
app.get('/test', (req, res) => {
  res.send('Server is running properly!');
});

// Route to show form for adding new cars
app.get('/cars/new', (req, res) => {
  res.render('new'); // Render the new car form
});

// POST route to create a new car
app.post('/cars', async (req, res) => {
  try {
    const newCar = await Car.create(req.body);
    res.redirect('/cars'); // Redirect to the list of cars
  } catch (err) {
    console.log(err);
    res.send('Error creating car');
  }
});

// GET route to display all cars
app.get('/cars', async (req, res) => {
  try {
    const cars = await Car.find({});
    res.render('index', { cars }); // Render the list of cars
  } catch (err) {
    console.log(err);
    res.send('Error retrieving cars');
  }
});

// GET route to show details of a specific car
app.get('/cars/:id', async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    res.render('show', { car });
  } catch (err) {
    console.log(err);
    res.send('Error retrieving car');
  }
});

// GET route to show the form to edit a car
app.get('/cars/:id/edit', async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    res.render('edit', { car });
  } catch (err) {
    console.log(err);
    res.send('Error retrieving car for editing');
  }
});

// PUT route to update a car
app.put('/cars/:id', async (req, res) => {
  try {
    await Car.findByIdAndUpdate(req.params.id, req.body);
    res.redirect(`/cars/${req.params.id}`);
  } catch (err) {
    console.log(err);
    res.send('Error updating car');
  }
});

// DELETE route to remove a car
app.delete('/cars/:id', async (req, res) => {
  try {
    await Car.findByIdAndDelete(req.params.id);
    res.redirect('/cars');
  } catch (err) {
    console.log(err);
    res.send('Error deleting car');
  }
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
