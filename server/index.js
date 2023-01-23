'use strict';

const bodyParser = require('body-parser');
const express = require('express');
const { join } = require('path');
const cors = require('cors');
const { mount } = require('./lib/server/rest/connectionsapi');
const WebRtcConnectionManager = require('./lib/server/connections/webrtcconnectionmanager');
const dotenv = require("dotenv");
const mongoose = require("mongoose");
dotenv.config();

const app = express();

app.use(cors());
app.use(bodyParser.json());

mongoose
  .connect(process.env.mongoose_URI, {
    useUnifiedTopology: true,
    autoIndex: false,
  })
  .then(() => {
    console.log("MongoDB connected!");
  })
  .catch((e) => {
    console.log(e.message);
  });

const broadcasterDirectoryPath = join(__dirname, 'broadcaster');
const serverPath = join(broadcasterDirectoryPath, 'server.js');
const options = require(serverPath);
const broadcasterDirectoryPath1 = join(__dirname, 'viewer');
const serverPath1 = join(broadcasterDirectoryPath1, 'server.js');
const options1 = require(serverPath1);
const connectionManager = WebRtcConnectionManager.create(options);
mount(app, connectionManager, '/broadcaster');
const connectionManager1 = WebRtcConnectionManager.create(options1);
mount(app, connectionManager1, '/viewer');

const server = app.listen(process.env.STREAM_PORT, () => {
  const address = server.address();
  console.log(`http://localhost:${address.port}\n`);

  server.once('close', () => {
    connectionManager.close();
  });
});
