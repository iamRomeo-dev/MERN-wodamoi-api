import dotenv from "dotenv";
import { createTerminus, HealthCheckError } from "@godaddy/terminus";
import http from "http";
import mongoose from "mongoose";
// import ora from "ora";
import app from "./app";

// Inject environment variables defined in the `.env` file placed at the root of the project.
dotenv.config();

/** @type {(url: string, options: mongoose.ConnectionOptions) => Promise<void>} */
const connectToDatabase = async (url, options) => {
  // const spinner = ora(`Connecting to database "${url}"`).start();
  console.log(`Connecting to database "${url}"`);
  try {
    await mongoose.connect(url, {
      // Use the new MongoDB driver implementation for parsing connection strings.
      // See: https://mongoosejs.com/docs/deprecations.html#the-usenewurlparser-option
      useNewUrlParser: true,
      // Allow the MongoDB driver to periodically check for changes in a MongoDB shared cluster.
      // See: https://mongoosejs.com/docs/deprecations.html#useunifiedtopology
      useUnifiedTopology: true,

      ...options,
    });
    console.log(`Connected to database "${url}"`);
    // spinner.succeed(`Connected to database "${url}"`);
  } catch (error) {
    console.log(`Failed to connect to database "${url}"`);
    // spinner.fail(`Failed to connect to database "${url}"`);
    throw error;
  }
};

/** @type {(server: http.Server, options: import('net').ListenOptions) => Promise<void>} */
const startHTTPServer = async (server, options) => {
  const address = `http://${options.host}:${options.port}`;
  console.log(`Starting HTTP server on "${address}"`);
  // const spinner = ora(`Starting HTTP server on "${address}"`).start();
  return new Promise((resolve, reject) => {
    server
      .listen(options, () => {
        console.log(`HTTP server started on "${address}"`);
        // spinner.succeed(`HTTP server started on "${address}"`);
        return resolve();
      })
      .on("error", (error) => {
        console.log(`Failed to start HTTP server on "${address}"`);
        // spinner.fail(`Failed to start HTTP server on "${address}"`);
        return reject(error);
      });
  });
};

const server = http.createServer(app);

createTerminus(server, {
  onSignal: async () => {
    await mongoose.connection.close();
  },
  healthChecks: {
    "/healthcheck": async () => {
      return mongoose.connection.readyState === 1
        ? Promise.resolve()
        : Promise.reject(new HealthCheckError("Database not connected"));
    },
  },
});

// Retrieve mongodb information from environement variables and connect to the database.
// While the connection is being established, mongoose will buffer operations.
// See: https://mongoosejs.com/docs/connections.html#buffering
connectToDatabase(process.env.MONGO_URL);

// Retrieve HTTP server host and port from environment variables,
// create HTTP server and listen to connections.
startHTTPServer(server, {
  host: process.env.HOST,
  port: Number(process.env.PORT),
});

export default app;
