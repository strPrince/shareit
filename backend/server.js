const express = require('express');
const cors = require('cors');
const path = require('path');
const uploadRoute = require('./routes/uploadRoute');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Static folder to serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use(uploadRoute);
// Health check
app.get('/', (req, res) => {
  res.send('Welcome to the ShareIt File Sharing App Backend!');
}); 

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
