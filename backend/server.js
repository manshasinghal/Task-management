require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/task-management-db';

// Use current recommended mongoose connection options and provide clear logging
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB successfully'))
  .catch(err => console.error('Could not connect to MongoDB:', err));

// Log more granular connection state changes (helpful during development)
mongoose.connection.on('connected', () => console.log('Mongoose connection: connected'));
mongoose.connection.on('error', (err) => console.error('Mongoose connection error:', err));
mongoose.connection.on('disconnected', () => console.log('Mongoose connection: disconnected'));

const authRoutes = require('./router/auth');
app.use('/api/auth', authRoutes);

const userRouter = require('./router/Userroute');
app.use('/api/users', userRouter);

const taskRouter = require('./router/taskRouter');
app.use('/api/tasks', taskRouter);


const PORT = process.env.PORT || 5000;
// Start server and handle listen errors (EADDRINUSE) gracefully so starting a second instance
// doesn't throw an unhandled exception.
const server = app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));

server.on('error', (err) => {
  if (err && err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Another process is listening on this port.`);
    process.exit(1);
  }
  console.error('Server error:', err);
  process.exit(1);
});

// Graceful shutdown
const shutdown = async () => {
  console.log('Shutting down server...');
  server.close(() => console.log('HTTP server closed'));
  try { await mongoose.disconnect(); console.log('Mongoose disconnected'); } catch (e) {}
  process.exit(0);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

// Export both app and server for tests/tools that may import them
module.exports = { app, server };
