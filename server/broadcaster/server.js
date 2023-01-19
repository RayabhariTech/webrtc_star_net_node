'use strict';

const { EventEmitter } = require('events');

const broadcaster = new EventEmitter();
const { on } = broadcaster;

function beforeOffer(peerConnection, connectionManagerInstance, currentPeerConnectionId) {
  // const audioTrack = broadcaster.audioTrack = peerConnection.addTransceiver('audio').receiver.track;
  // const videoTrack = broadcaster.videoTrack = peerConnection.addTransceiver('video').receiver.track;
  const audioTransceiver = peerConnection.addTransceiver('audio')
  const videoTransceiver = peerConnection.addTransceiver('video')
  const audioTrack = broadcaster.audioTrack = audioTransceiver.receiver.track;
  const videoTrack = broadcaster.videoTrack = videoTransceiver.receiver.track;

  function onNewBroadcast({ audioTrack, videoTrack }) {
    const { peerConnections, connections } = connectionManagerInstance.getPeerConnections();
    const allPeerConnections = [...peerConnections.values()];
    console.log(14, allPeerConnections, connections);
    const states = ["closed", "failed", "disconnected"]
    var i = 0
    for (let [key, value] of peerConnections) {
      console.log(key, currentPeerConnectionId, key === currentPeerConnectionId)
      if (key === currentPeerConnectionId)
        continue;
      if(states.includes(value.connectionState))
        continue;
      if(i==0){
        value.getTransceivers().map(trans=>{
          if(trans.receiver.track.kind === "audio"){
            audioTransceiver.sender.replaceTrack(trans.receiver.track);
          }
          if(trans.receiver.track.kind === "video"){
            videoTransceiver.sender.replaceTrack(trans.receiver.track);
          }
        })
        // audioTransceiver.sender.replaceTrack(value.getTransceivers()[0].receiver.track);
        // videoTransceiver.sender.replaceTrack(value.getTransceivers()[1].receiver.track);
      } else{
        const audioTransceiver1 = peerConnection.addTransceiver('audio')
        const videoTransceiver1 = peerConnection.addTransceiver('video')
        value.getTransceivers().map(trans=>{
          if(trans.receiver.track.kind === "audio"){
            audioTransceiver1.sender.replaceTrack(trans.receiver.track);
          }
          if(trans.receiver.track.kind === "video"){
            videoTransceiver1.sender.replaceTrack(trans.receiver.track);
          }
        })
        // audioTransceiver1.sender.replaceTrack(value.getTransceivers()[0].receiver.track);
        // videoTransceiver1.sender.replaceTrack(value.getTransceivers()[1].receiver.track);
      }
      i+=1
      // value.getTransceivers.map(transceiver =>{
      //   transceiver.receiver.track
      // })

    //   console.log(value.id, value.status);
    //   console.log("k:",key)
    //   console.log("curr:",currentPeerConnectionId)
    //   if (key === currentPeerConnectionId)
    //     continue;
    //   if(states.includes(value.connectionState))
    //     continue;
      // const audioTransceiver = peerConnection.addTransceiver('audio');
      // const videoTransceiver = peerConnection.addTransceiver('video');
    //   console.log("r:",peerConnection.getReceivers())
      // audioTransceiver.sender.replaceTrack(audioTrack);
      // videoTransceiver.sender.replaceTrack(videoTrack);

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
