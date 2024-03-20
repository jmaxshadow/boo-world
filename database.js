const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

async function startDatabase() {
  const mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();

  try {
    await mongoose.connect(mongoUri);
    console.log("In-memory MongoDB started at", mongoUri);

    return {
      close: async () => {
        // await mongoose.disconnect();
        await mongoose.connection.close();
        await mongoServer.stop()
      },
    };
  } catch (err) {
    console.error("Failed to connect to MongoDB:", err);
  }

  return mongoServer;
}

module.exports = startDatabase;