/*
 *  Copyright (c) 2015 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */

'use strict';

var localConnection;
var sendChannel;
var receiveChannel;
var pcConstraint;
var dataConstraint;

var connectButton = document.querySelector('button#connectButton');
var sendButton = document.querySelector('button#sendButton');
var closeButton = document.querySelector('button#closeButton');
var offerSetupButton = document.querySelector('button#offerSetupButton');
var answerSetupButton = document.querySelector('button#answerSetupButton');
var offerButton = document.querySelector('button#offerButton');
var answerButton = document.querySelector('button#answerButton');

var dataChannelSend = document.querySelector('textarea#dataChannelSend');
var dataChannelReceive = document.querySelector('textarea#dataChannelReceive');
var localDesc = document.querySelector('textarea#localDesc');
var remoteDesc = document.querySelector('textarea#remoteDesc');
var iceCandidateOffer = document.querySelector('textarea#iceCandidateOffer');
var iceCandidateAnswer = document.querySelector('textarea#iceCandidateAnswer');

connectButton.onclick = doConnect;
sendButton.onclick = sendData;
closeButton.onclick = closeDataChannels;

offerSetupButton.onclick = offerSetup;
answerSetupButton.onclick = answerSetup;
offerButton.onclick = createOfferManual;
answerButton.onclick = createAnswerManual;

// mandatories
var localInfo = {};

function disableSendButton() {
  sendButton.disabled = true;
}

function offerSetup() {
  dataChannelSend.placeholder = '';
  var servers = null;
  pcConstraint = null;
  dataConstraint = null;
  trace('Using SCTP based data channels');
  window.localConnection = localConnection =
      new RTCPeerConnection(servers, pcConstraint);
  trace('Created local peer connection object localConnection');

  sendChannel = localConnection.createDataChannel('sendDataChannel',
      dataConstraint);
  trace('Created send data channel');

  localConnection.onicecandidate = function(e) {
    if (e.candidate && e.candidate.candidate.indexOf('.') > -1)
    {
      console.log("localConnection.onicecandidate");
      console.log(e);
      iceCandidateOffer.value += JSON.stringify(e.candidate);
      localInfo.candidate = e.candidate;
      makeQRIfReady();
    }
    else
      console.log("");
    /*
    localConnection.addIceCandidate(e.candidate)
    .then(
      function() {
        onAddIceCandidateSuccess(localConnection);
      },
      function(err) {
        onAddIceCandidateError(localConnection, err);
      }
    );
    */
  };
  sendChannel.onopen = onSendChannelStateChange;
  sendChannel.onclose = onSendChannelStateChange;
  createOfferManual();
}

function createOfferManual() {
  console.log("create offer");
  localConnection.createOffer().then(
    gotLocalDescription,
    onCreateSessionDescriptionError
  );
  closeButton.disabled = false;
}

function gotLocalDescription(desc) {
  console.log("localConnection.setLocalDescription");
  localConnection.setLocalDescription(desc);
  trace('Offer from localConnection \n' + desc.sdp);
  console.log(desc);

  localDesc.value = JSON.stringify(desc);
  localInfo.desc = desc;
  makeQRIfReady();
}

function makeQRIfReady() {
  console.log(localInfo);
  console.log('string: ' + JSON.stringify(localInfo));
  console.log('count: ' + JSON.stringify(localInfo).length);
  document.getElementById("qrimage").innerHTML="<img src='https://chart.googleapis.com/chart?chs=500x500&cht=qr&chl="+encodeURIComponent(JSON.stringify(localInfo))+"'/>";
}

function answerSetup() {
  dataChannelSend.placeholder = '';
  var servers = null;
  pcConstraint = null;
  dataConstraint = null;
  trace('Using SCTP based data channels');

  window.localConnection = localConnection =
      new RTCPeerConnection(servers, pcConstraint);
  trace('Created remote peer connection object localConnection');

  localConnection.onicecandidate = function(e) {
    if (e.candidate && e.candidate.candidate.indexOf('.') > -1)
    {
      console.log("localConnection.onicecandidate " + e.candidate.candidate.indexOf('.'));
      console.log(e);
      iceCandidateOffer.value += JSON.stringify(e.candidate);
      localInfo.candidate = e.candidate;
      makeQRIfReady();
    }
    else
      console.log("");
  };
  localConnection.ondatachannel = receiveChannelCallback;
  createAnswerManual();
}

function createAnswerManual() {
  //var desc = JSON.parse(remoteDesc.value);
  var server = JSON.parse(document.querySelector('textarea#serverInfo').value);
  var desc = server.desc;
  console.log("localConnection.setRemoteDescription");
  localConnection.setRemoteDescription(desc);
  console.log("create answer");
  localConnection.createAnswer().then(
    gotRemoteDescription,
    onCreateSessionDescriptionError
  );

  //localConnection.addIceCandidate(JSON.parse(iceCandidateAnswer.value));
  localConnection.addIceCandidate(server.candidate);
}

function gotRemoteDescription(desc) {
  console.log("localConnection.setLocalDescription");
  localConnection.setLocalDescription(desc);
  trace('Answer from localConnection \n' + desc);
  console.log(desc);
  localDesc.value = JSON.stringify(desc);
  localInfo.desc = desc;
  makeQRIfReady();
}


function onCreateSessionDescriptionError(error) {
  trace('Failed to create session description: ' + error.toString());
}

function doConnect() {
  //var desc = JSON.parse(remoteDesc.value);
  var client = JSON.parse(document.querySelector('textarea#clientInfo').value);
  var desc = client.desc;
  console.log("localConnection.setRemoteDescription");
  localConnection.setRemoteDescription(desc);
  //localConnection.addIceCandidate(JSON.parse(iceCandidateAnswer.value));
  localConnection.addIceCandidate(client.candidate);
}

function onAddIceCandidateSuccess() {
  console.log('AddIceCandidate success.');
}

function onAddIceCandidateError(error) {
  console.log('Failed to add Ice Candidate: ' + error.toString());
}

function receiveChannelCallback(event) {
  console.log('Receive Channel Callback');
  receiveChannel = event.channel;
  receiveChannel.onmessage = onReceiveMessageCallback;
  receiveChannel.onopen = onReceiveChannelStateChange;
  receiveChannel.onclose = onReceiveChannelStateChange;
}

function onReceiveMessageCallback(event) {
  trace('Received Message');
  dataChannelReceive.value = event.data;
}

function onSendChannelStateChange() {
  var readyState = sendChannel.readyState;
  console.log('Send channel state is: ' + readyState);
  if (readyState === 'open') {
    dataChannelSend.disabled = false;
    dataChannelSend.focus();
    sendButton.disabled = false;
    closeButton.disabled = false;
  } else {
    dataChannelSend.disabled = true;
    sendButton.disabled = true;
    closeButton.disabled = true;
  }
}

function onReceiveChannelStateChange() {
  var readyState = receiveChannel.readyState;
  console.log('Receive channel state is: ' + readyState);
}

function sendData() {
  var data = dataChannelSend.value;
  sendChannel.send(data);
  trace('Sent Data: ' + data);
}

function closeDataChannels() {
  trace('Closing data channels');
  sendChannel.close();
  trace('Closed data channel with label: ' + sendChannel.label);
  receiveChannel.close();
  trace('Closed data channel with label: ' + receiveChannel.label);
  localConnection.close();
  localConnection.close();
  localConnection = null;
  localConnection = null;
  trace('Closed peer connections');
  sendButton.disabled = true;
  closeButton.disabled = true;
  dataChannelSend.value = '';
  dataChannelReceive.value = '';
  dataChannelSend.disabled = true;
  disableSendButton();
}

