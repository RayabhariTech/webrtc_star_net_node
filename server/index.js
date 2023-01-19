'use strict';

const bodyParser = require('body-parser');
const express = require('express');
const { join } = require('path');
const cors = require('cors');
const { mount } = require('./lib/server/rest/connectionsapi');
const WebRtcConnectionManager = require('./lib/server/connections/webrtcconnectionmanager');

const app = express();

app.use(cors());
app.use(bodyParser.json());

const broadcasterDirectoryPath = join(__dirname, 'broadcaster');
const serverPath = join(broadcasterDirectoryPath, 'server.js');
const options = require(serverPath);
const connectionManager = WebRtcConnectionManager.create(options);
mount(app, connectionManager, '/broadcaster');

const server = app.listen(3000, () => {
  const address = server.address();
  console.log(`http://localhost:${address.port}\n`);

  server.once('close', () => {
    connectionManager.close();
  });
});
