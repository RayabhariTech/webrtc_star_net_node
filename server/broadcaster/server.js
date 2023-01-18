'use strict';

const { EventEmitter } = require('events');

const broadcaster = new EventEmitter();
const { on } = broadcaster;

function beforeOffer(peerConnection, connectionManagerInstance, currentPeerConnectionId) {
  const audioTrack = broadcaster.audioTrack = peerConnection.addTransceiver('audio').receiver.track;
  const videoTrack = broadcaster.videoTrack = peerConnection.addTransceiver('video').receiver.track;

  function onNewBroadcast({ audioTrack, videoTrack }) {
    const { peerConnections, connections } = connectionManagerInstance.getPeerConnections();
    const allPeerConnections = [...peerConnections.values()];
    console.log(14, allPeerConnections, connections);
    for (let [key, value] of peerConnections) {
      console.log(value.id, value.status);
      if (key === currentPeerConnectionId)
        continue;
      const audioTransceiver = value.addTransceiver('audio');
      const videoTransceiver = value.addTransceiver('video');
      audioTransceiver.sender.replaceTrack(audioTrack);
      videoTransceiver.sender.replaceTrack(videoTrack);

    }
  }

  onNewBroadcast({
    audioTrack,
    videoTrack
  });

  const { close } = peerConnection;
  // eslint-disable-next-line space-before-function-paren
  peerConnection.close = function () {
    audioTrack.stop();
    videoTrack.stop();
    return close.apply(this, arguments);
  };
}

module.exports = {
  beforeOffer,
  broadcaster
};
