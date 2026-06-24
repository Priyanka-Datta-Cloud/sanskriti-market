const mongoose = require('mongoose');
require('dotenv').config();

const createIndexes = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Creating database indexes...');

  const collections = ['users', 'products', 'stores', 'orders', 'reviews', 'stories'];
  for (const name of collections) {
    try {
      await mongoose.connection.db.collection(name).createIndexes();
      console.log(`Indexes ensured for ${name}`);
    } catch (err) {
      console.warn(`Index warning for ${name}:`, err.message);
    }
  }

  await mongoose.disconnect();
  console.log('Index creation complete.');
};

if (require.main === module) {
  createIndexes().catch(console.error);
}

module.exports = createIndexes;
