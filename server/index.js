'use strict';

const bodyParser = require('body-parser');
const express = require('express');
const { join } = require('path');
const cors = require('cors');
const { mount } = require('./lib/server/rest/connectionsapi');
const WebRtcConnectionManager = require('./lib/server/connections/webrtcconnectionmanager');
const dotenv = require("dotenv");
dotenv.config();

const app = express();

// app.use(cors());
app.use(bodyParser.json());

const broadcasterDirectoryPath = join(__dirname, 'broadcaster');
const serverPath = join(broadcasterDirectoryPath, 'server.js');
const options = require(serverPath);
const connectionManager = WebRtcConnectionManager.create(options);
mount(app, connectionManager, '/stream_api/broadcaster');

const server = app.listen(process.env.STREAM_PORT, () => {
  const address = server.address();
  console.log(`http://localhost:${address.port}\n`);

  server.once('close', () => {
    connectionManager.close();
  });
});
