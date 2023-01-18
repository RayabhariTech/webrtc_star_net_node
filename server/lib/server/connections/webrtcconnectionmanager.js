'use strict';

const connectionManagerInstance = require('./connectionmanager');
const WebRtcConnection = require('./webrtcconnection');

class WebRtcConnectionManager {
  constructor(options = {}) {
    options = {
      Connection: WebRtcConnection,
      ...options
    };
    connectionManagerInstance.updateOptions(options);

    this.createConnection = async () => {
      const connection = connectionManagerInstance.createConnection();
      await connection.doOffer();
      return connection;
    };

    this.getConnection = id => {
      return connectionManagerInstance.getConnection(id);
    };

    this.getConnections = () => {
      return connectionManagerInstance.getConnections();
    };

    this.getPeerConnections = () => {
      return connectionManagerInstance.getPeerConnections();
    };
  }

  toJSON() {
    return this.getConnections().map(connection => connection.toJSON());
  }

  static create(options) {
    return new WebRtcConnectionManager({
      // eslint-disable-next-line space-before-function-paren
      Connection: function (id) {
        return new WebRtcConnection(id, options, connectionManagerInstance);
      }
    });
  }
}

// WebRtcConnectionManager.create = function create(options) {
//   return new WebRtcConnectionManager({
//     Connection: function (id) {
//       return new WebRtcConnection(id, options);
//     }
//   });
// };

module.exports = WebRtcConnectionManager;
