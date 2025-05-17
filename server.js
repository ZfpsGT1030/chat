// server.js
require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('🔗 MongoDB connected'))
  .catch(err => console.error(err));

// Message schema
const messageSchema = new mongoose.Schema({
  user: String,
  text: String,
  timestamp: { type: Date, default: Date.now }
});
const Message = mongoose.model('Message', messageSchema);

// Serve static files
app.use(express.static('public'));

io.on('connection', socket => {
  console.log('🟢 New client connected');
  // Send last 100 messages
  Message.find().sort({ timestamp: 1 }).limit(100).exec((err, msgs) => {
    if (!err) socket.emit('load messages', msgs);
  });

  socket.on('new message', data => {
    const msg = new Message({ user: data.user, text: data.text });
    msg.save().then(() => {
      io.emit('message', msg);
    });
  });

  socket.on('disconnect', () => console.log('🔴 Client disconnected'));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
