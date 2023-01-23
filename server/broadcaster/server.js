'use strict';

const { count } = require('console');
const { EventEmitter } = require('events');
const countModel = require('../models/count');

const broadcaster = new EventEmitter();
const { on } = broadcaster;

async function beforeOffer(peerConnection) {
  var audioTrack, videoTrack
  if(broadcaster.audioTrack){
    audioTrack = broadcaster.audioTrack = [...broadcaster.audioTrack,peerConnection.addTransceiver('audio').receiver.track];
    videoTrack = broadcaster.videoTrack = [...broadcaster.videoTrack,peerConnection.addTransceiver('video').receiver.track];
  } else{
    audioTrack = broadcaster.audioTrack = [peerConnection.addTransceiver('audio').receiver.track];
    videoTrack = broadcaster.videoTrack = [peerConnection.addTransceiver('video').receiver.track];
  }

  const count = await countModel.findOneAndUpdate({}, {$inc:{count:1}},{upsert:true,new:true})

  broadcaster.emit('newBroadcast', {
    audioTrack,
    videoTrack
  });

  const { close } = peerConnection;
  peerConnection.close = function() {
    for(i=0;i<audioTrack.length;i++){
      audioTrack[i].stop()
      videoTrack[i].stop()
    }
    return close.apply(this, arguments);
  };
}

module.exports = { 
  beforeOffer,
  broadcaster
};
