const mongoose = require("mongoose");
const util = require("util");


class Mongodb {
  constructor() {
    const config = (require('../config.json')[process.env.NODE_ENV.trim() || 'development'] || {}).mongodb;

    if (!config) {
      console.error("MongoDB configuration not found for the specified environment.");
      process.exit(1);
    }

    this.uri = util.format(
      'mongodb://%s:%s@%s:%s/%s?authSource=%s',
      config.user,
      config.pass,
      config.host,
      config.port,
      config.db,
      config.auth_source
    );

    this.init();
  }

  init() {
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      reconnectInterval: 500,
      poolSize: 5,
      connectTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      family: 4, // Use IPv4, skip trying IPv6
    };

    mongoose.connect(this.uri, options).then(
      () => {
        console.log("MongoDB: Connection Successful");
      },
      (err) => {
        console.error("MongoDB: Connection failed", err);
        process.exit(1); // Exit the process on connection failure
      }
    );

    mongoose.set("useCreateIndex", true);

    mongoose.connection.on("error", (err) => {
      console.error("MongoDB: Connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("MongoDB: Disconnected, attempting to reconnect...");
    });

    mongoose.connection.on("reconnected", () => {
      console.log("MongoDB: Reconnected successfully");
    });

    // Handle connection close gracefully
    process.on("SIGINT", async () => {
      await mongoose.connection.close();
      console.log("MongoDB: Connection closed due to app termination");
      process.exit(0);
    });
  }
}

module.exports = new Mongodb();
