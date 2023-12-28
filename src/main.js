require("dotenv").config();

const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const usersRoutes = require('./routes/usersRoutes');
const tasksRoutes = require('./routes/tasksRoutes');
const authRoutes = require('./routes/authRoutes');

// parse JSON request bodies
app.use(bodyParser.json());

// Routes
app.use('/api', authRoutes);
app.use('/api', usersRoutes);
app.use('/api', tasksRoutes);

// Start the server
const PORT = process.env.PORT || 8010;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

