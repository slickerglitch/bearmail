// server.js
const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer'); // Nodemailer is a Node.js module that allows sending of emails from a server
const imap = require('imap');
const { simpleParser } = require('mailparser');

const app = express();
app.use(bodyParser.json());

// Nodemailer setup for sending emails
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your-email@gmail.com',
    pass: 'your-email-password'
  }
});

// Sending email route
app.post('/send', (req, res) => {
  const mailOptions = {
    from: 'your-email@gmail.com',
    to: req.body.to,
    subject: req.body.subject,
    text: req.body.text
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).send(error.toString());
    }
    res.status(200).send('Email sent: ' + info.response);
  });
});

// Receiving emails route
app.get('/receive', (req, res) => {
  const imap = new imap({
    user: 'your-email@gmail.com',
    password: 'your-email-password',
    host: 'imap.gmail.com',
    port: 993,
    tls: true
  });

  imap.once('ready', () => {
    imap.openBox('INBOX', true, (err, box) => {
      if (err) throw err;
      imap.search(['UNSEEN', ['SINCE', 'May 20, 2020']], (err, results) => {
        if (err) throw err;
        const f = imap.fetch(results, { bodies: '' });
        f.on('message', (msg, seqno) => {
          msg.on('body', (stream, info) => {
            simpleParser(stream, (err, mail) => {
              // mail object has email data
              console.log(mail);
              res.json(mail);
            });
          });
        });
        f.once('end', () => {
          imap.end();
        });
      });
    });
  });

  imap.once('error', (err) => {
    console.log(err);
  });

  imap.once('end', () => {
    console.log('Connection ended');
  });

  imap.connect();
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
