'use strict';

const { broadcaster } = require('../broadcaster/server');
const countModel = require('../models/count');

async function beforeOffer(peerConnection) {
//   const audioTransceiver = peerConnection.addTransceiver('audio');
//   const videoTransceiver = peerConnection.addTransceiver('video');
  
    function onNewBroadcast({ audioTrack, videoTrack }) {
        console.log("her")
        videoTrack.map((video, index)=>{
            const audioTransceiver = peerConnection.addTransceiver('audio');
            const videoTransceiver = peerConnection.addTransceiver('video');
            console.log("replace track")
            console.log(audioTrack)
            console.log(videoTrack)
            audioTransceiver.sender.replaceTrack(audioTrack[index]),
            videoTransceiver.sender.replaceTrack(video) 
        })
  }

//   broadcaster.on('newBroadcast', onNewBroadcast)

//   const count = await countModel.findOne({})
//   console.log('newBroadcast'+count.count)
//   for(var i=1; i<=count.count; i++){
//     console.log("heree")

//     broadcaster.on('newBroadcast'+i, onNewBroadcast)
//   }

  if (broadcaster.audioTrack && broadcaster.videoTrack) {
    onNewBroadcast(broadcaster);
  }

  const { close } = peerConnection;
  peerConnection.close = function() {
    broadcaster.removeListener('newBroadcast', onNewBroadcast);
    return close.apply(this, arguments);
  }
}

module.exports = { beforeOffer };
