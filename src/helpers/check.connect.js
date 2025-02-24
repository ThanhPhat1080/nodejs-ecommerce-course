'use strict';

import mongoose from 'mongoose';
import os from 'os';
import process from 'process';

const __SECONDS = 5000;

/**
 * Count the number of connections to the MongoDB database
 * @returns {number} The number of connections to the MongoDB database
 */
const countConnect = () => {
  const numConnection = mongoose.connections.length;
  console.log(`Number of connections: ${numConnection}`);
};

/**
 * Check overloaded connection to MongoDB
 */
const checkOverload = () => {
  setInterval(() => {
    const numConnection = mongoose.connections.length;
    console.log(`Number of connections: ${numConnection}`);

    const numCores = os.cpus().length;
    const memoryUsage = process.memoryUsage().rss;

    // Example: maximum number of connections = CPU cores * 5
    const maxConnections = numCores * 5;
    if (numConnection >= maxConnections) {
      console.log(`Connection overload detected!`);

      // Notify to Admin
      // notify.send(...)
    }

    console.log('Active connection: ', numConnection);
    console.log(`memory usage:: ${memoryUsage / 1024 / 1024} MB`);
  }, __SECONDS); // Monitor every 5 seconds
};
export default {
  countConnect,
  checkOverload,
};
