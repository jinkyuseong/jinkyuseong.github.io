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
var serverButton = document.querySelector('button#serverButton');
var clientButton = document.querySelector('button#clientButton');

var serverInfoDiv = document.querySelector('div#serverInfoDiv');
var clientInfoDiv = document.querySelector('div#clientInfoDiv');

var dataChannelSend = document.querySelector('textarea#dataChannelSend');
var dataChannelReceive = document.querySelector('textarea#dataChannelReceive');

serverButton.onclick = offerSetup;
clientButton.onclick = answerSetup;
connectButton.onclick = doConnect;
sendButton.onclick = sendData;
closeButton.onclick = closeDataChannels;

// mandatories
var localInfo = {};
serverInfoDiv.style.display = 'block';
clientInfoDiv.style.display = 'none';

function disableSendButton() {
  sendButton.disabled = true;
}

function offerSetup() {
  dataChannelSend.placeholder = '';
  var servers = null;
  pcConstraint = null;
  dataConstraint = null;
  window.localConnection = localConnection =
      new RTCPeerConnection(servers, pcConstraint);

  sendChannel = localConnection.createDataChannel('sendDataChannel',
      dataConstraint);

  localConnection.onicecandidate = function(e) {
    if (e.candidate && e.candidate.candidate.indexOf('.') > -1)
    {
      console.log("localConnection.onicecandidate");
      console.log(e);
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
  sendChannel.onmessage = onReceiveMessageCallback;
  createOfferManual();
}

function createOfferManual() {
  console.log("create offer");
  localConnection.createOffer().then(
    gotLocalDescription,
    onCreateSessionDescriptionError
  );
  closeButton.disabled = false;
  serverInfoDiv.style.display = 'none';
  clientInfoDiv.style.display = 'block';
}

function gotLocalDescription(desc) {
  console.log("localConnection.setLocalDescription");
  localConnection.setLocalDescription(desc);
  console.log(desc);

  localInfo.desc = desc;
  connectButton.disabled = false;
  clientButton.disabled = true;
  makeQRIfReady();
}

function makeQRIfReady() {
  var localInfoString = JSON.stringify(localInfo);
  console.log(localInfo);
  console.log('string: ' + localInfoString);
  console.log('count: ' + localInfoString.length);
  document.getElementById("qrimage").innerHTML="<img src='https://chart.googleapis.com/chart?chs=500x500&cht=qr&chl="+encodeURIComponent(localInfoString)+"'/>";
  document.querySelector('textarea#localInfo').value = localInfoString;
}

function answerSetup() {
  dataChannelSend.placeholder = '';
  var servers = null;
  pcConstraint = null;
  dataConstraint = null;

  window.localConnection = localConnection =
      new RTCPeerConnection(servers, pcConstraint);

  localConnection.onicecandidate = function(e) {
    if (e.candidate && e.candidate.candidate.indexOf('.') > -1)
    {
      console.log("localConnection.onicecandidate " + e.candidate.candidate.indexOf('.'));
      console.log(e);
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
  var server = JSON.parse(document.querySelector('textarea#serverInfo').value);
  var desc = server.desc;
  console.log("localConnection.setRemoteDescription");
  localConnection.setRemoteDescription(desc);
  console.log("create answer");
  localConnection.createAnswer().then(
    gotRemoteDescription,
    onCreateSessionDescriptionError
  );

  localConnection.addIceCandidate(server.candidate);
  serverInfoDiv.style.display = 'block';
}

function gotRemoteDescription(desc) {
  console.log("localConnection.setLocalDescription");
  localConnection.setLocalDescription(desc);
  console.log(desc);
  localInfo.desc = desc;
  serverButton.disabled = true;
  makeQRIfReady();
}


function onCreateSessionDescriptionError(error) {
}

function doConnect() {
  var client = JSON.parse(document.querySelector('textarea#clientInfo').value);
  var desc = client.desc;
  console.log("localConnection.setRemoteDescription");
  localConnection.setRemoteDescription(desc);
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
  dataChannelSend.disabled = false;
  dataChannelSend.focus();
  sendButton.disabled = false;
  closeButton.disabled = false;
}

function onReceiveMessageCallback(event) {
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
  if (sendChannel)
    sendChannel.send(data);
  if (receiveChannel)
    receiveChannel.send(data);
}

function closeDataChannels() {
  sendChannel.close();
  receiveChannel.close();
  localConnection.close();
  localConnection.close();
  localConnection = null;
  localConnection = null;
  sendButton.disabled = true;
  closeButton.disabled = true;
  dataChannelSend.value = '';
  dataChannelReceive.value = '';
  dataChannelSend.disabled = true;
  disableSendButton();
}