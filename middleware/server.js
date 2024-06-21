// server.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const authMiddleware = require('./middleware/auth');
const nodemailer = require('nodemailer');
const Imap = require('imap');
const { simpleParser } = require('mailparser');

const app = express();
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/email-client', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use('/api/auth', authRoutes);

// Protected route example
app.get('/api/protected', authMiddleware, (req, res) => {
  res.send('This is a protected route');
});

// Nodemailer and IMAP configuration, routes for sending and receiving emails
// ... (as previously defined)

const port = 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
