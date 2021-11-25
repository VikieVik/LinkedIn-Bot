window.onload = function () {
  console.log("popup.js started");

  var connectionCount = 1;

  //Listen for messages from content.js
  chrome.runtime.onMessage.addListener(function (
    message,
    sender,
    sendResponse
  ) {
    sendResponse({
      data: "linkedin connect click count received",
    });
    //console.log(message);
    document.getElementById("connection-counter").innerHTML = connectionCount++;
  });

  document.getElementById("start-stop-button").onclick = buttonCliked;

  //handle connect button click
  function buttonCliked() {
    chrome.tabs.query({ active: true, currentWindow: true }, onGettingTabInfo);
  }
};

var startConnecting = false;

function onGettingTabInfo(tab) {
  console.log("got tab data", tab);
  console.log("sending message");

  let messagePayload = {
    startConnecting: !startConnecting,
  };
  startConnecting = !startConnecting;
  //change botton color & text of button for start/stop state
  if (startConnecting) {
    let startStopBtnElement = document.getElementById("start-stop-button");
    console.log(startStopBtnElement);
    startStopBtnElement.style["background-color"] = "#F3B4B3";
    startStopBtnElement.innerHTML = "STOP CONNECTING";
  } else {
    let startStopBtnElement = document.getElementById("start-stop-button");
    startStopBtnElement.style["background-color"] = "#8cc99f";
    startStopBtnElement.innerHTML = "START CONNECTING";
  }
  chrome.tabs.sendMessage(tab[0].id, messagePayload);
}
