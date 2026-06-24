process.env.NODE_OPTIONS = '--dns-result-order=ipv4first';
const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
require('dotenv').config();
const mongoose = require('mongoose');

const uri = process.env.MONGODB_URI;
console.log('Connecting to:', uri?.substring(0, 50) + '...');

mongoose.connect(uri, {
  serverSelectionTimeoutMS: 10000,
  family: 4,
}).then(() => {
  console.log('SUCCESS! MongoDB Connected!');
  process.exit(0);
}).catch((err) => {
  console.log('FAILED:', err.message);
  process.exit(1);
});