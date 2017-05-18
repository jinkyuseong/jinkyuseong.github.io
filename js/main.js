/*
 *  Copyright (c) 2015 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */

'use strict';

var localConnection;
var remoteConnection;
var sendChannel;
var receiveChannel;
var pcConstraint;
var dataConstraint;
var dataChannelSend = document.querySelector('textarea#dataChannelSend');
var dataChannelReceive = document.querySelector('textarea#dataChannelReceive');
var localDesc = document.querySelector('textarea#localDesc');
var remoteDesc = document.querySelector('textarea#remoteDesc');
var startButton = document.querySelector('button#startButton');
var doneButton = document.querySelector('button#doneButton');
var connectButton = document.querySelector('button#connectButton');
var sendButton = document.querySelector('button#sendButton');
var closeButton = document.querySelector('button#closeButton');

var offerSetupButton = document.querySelector('button#offerSetupButton');
var answerSetupButton = document.querySelector('button#answerSetupButton');
var offerButton = document.querySelector('button#offerButton');
var answerButton = document.querySelector('button#answerButton');
var iceCandidateOffer = document.querySelector('textarea#iceCandidateOffer');
var iceCandidateAnswer = document.querySelector('textarea#iceCandidateAnswer');

//startButton.onclick = createConnection;
doneButton.onclick = setRemoteDescriptionManual;
connectButton.onclick = doConnect;
sendButton.onclick = sendData;
closeButton.onclick = closeDataChannels;

offerSetupButton.onclick = offerSetup;
answerSetupButton.onclick = answerSetup;
offerButton.onclick = createOfferManual;
answerButton.onclick = createAnswerManual;

function enableStartButton() {
  startButton.disabled = false;
}

function disableSendButton() {
  sendButton.disabled = true;
}

function offerSetup() {
  dataChannelSend.placeholder = '';
  var servers = null;
  pcConstraint = null;
  dataConstraint = null;
  trace('Using SCTP based data channels');
  // SCTP is supported from Chrome 31 and is supported in FF.
  // No need to pass DTLS constraint as it is on by default in Chrome 31.
  // For SCTP, reliable and ordered is true by default.
  // Add localConnection to global scope to make it visible
  // from the browser console.
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
}

function answerSetup() {
  dataChannelSend.placeholder = '';
  var servers = null;
  pcConstraint = null;
  dataConstraint = null;
  trace('Using SCTP based data channels');

  // Add remoteConnection to global scope to make it visible
  // from the browser console.
  window.remoteConnection = remoteConnection =
      new RTCPeerConnection(servers, pcConstraint);
  trace('Created remote peer connection object remoteConnection');

  remoteConnection.onicecandidate = function(e) {
    if (e.candidate && e.candidate.candidate.indexOf('.') > -1)
    {
      console.log("remoteConnection.onicecandidate " + e.candidate.candidate.indexOf('.'));
      console.log(e);
      iceCandidateOffer.value += JSON.stringify(e.candidate);
    }
    else
      console.log("");
  };
  remoteConnection.ondatachannel = receiveChannelCallback;
}

function createOfferManual() {
  console.log("create offer");
  localConnection.createOffer().then(
    gotDescription1,
    onCreateSessionDescriptionError
  );
  startButton.disabled = true;
  closeButton.disabled = false;
}

function createAnswerManual() {
  var desc = JSON.parse(remoteDesc.value);
  console.log("remoteConnection.setRemoteDescription");
  remoteConnection.setRemoteDescription(desc);
  console.log("create answer");
  remoteConnection.createAnswer().then(
    gotDescription2,
    onCreateSessionDescriptionError
  );

  remoteConnection.addIceCandidate(JSON.parse(iceCandidateAnswer.value));
}

function onCreateSessionDescriptionError(error) {
  trace('Failed to create session description: ' + error.toString());
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
  remoteConnection.close();
  localConnection = null;
  remoteConnection = null;
  trace('Closed peer connections');
  startButton.disabled = false;
  sendButton.disabled = true;
  closeButton.disabled = true;
  dataChannelSend.value = '';
  dataChannelReceive.value = '';
  dataChannelSend.disabled = true;
  disableSendButton();
  enableStartButton();
}

function gotDescription1(desc) {
  console.log("localConnection.setLocalDescription");
  localConnection.setLocalDescription(desc);
  trace('Offer from localConnection \n' + desc.sdp);
  console.log(desc);

  localDesc.value = JSON.stringify(desc);

/*
  remoteConnection.setRemoteDescription(desc);
  remoteConnection.createAnswer().then(
    gotDescription2,
    onCreateSessionDescriptionError
  );
*/
}

function setRemoteDescriptionManual() {
  var desc = JSON.parse(remoteDesc.value);
  remoteConnection.setRemoteDescription(desc);
}

function doConnect() {
  var desc = JSON.parse(remoteDesc.value);
  console.log("localConnection.setRemoteDescription");
  localConnection.setRemoteDescription(desc);
  localConnection.addIceCandidate(JSON.parse(iceCandidateAnswer.value));
}

function gotDescription2(desc) {
  console.log("remoteConnection.setLocalDescription");
  remoteConnection.setLocalDescription(desc);
  trace('Answer from remoteConnection \n' + desc);
  console.log(desc);
  localDesc.value = JSON.stringify(desc);
//  localConnection.setRemoteDescription(desc);
}

function getOtherPc(pc) {
  return (pc === localConnection) ? remoteConnection : localConnection;
}

function getName(pc) {
  return (pc === localConnection) ? 'localPeerConnection' :
      'remotePeerConnection';
}

function onIceCandidate(pc, event) {
  /*
  getOtherPc(pc).addIceCandidate(event.candidate)
  .then(
    function() {
      onAddIceCandidateSuccess(pc);
    },
    function(err) {
      onAddIceCandidateError(pc, err);
    }
  );
  trace(getName(pc) + ' ICE candidate: \n' + (event.candidate ?
      event.candidate.candidate : '(null)'));
  trace(event.candidate);
  trace(event.candidate.candidate);
  */
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
