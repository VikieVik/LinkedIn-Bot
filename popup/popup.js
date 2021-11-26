window.onload = function () {
  var connectionCount = 1;

  //Listen for messages from content.js
  chrome.runtime.onMessage.addListener(function (
    message,
    sender,
    sendResponse
  ) {
    sendResponse({
      data: "connect acknowledgement received by popup",
    });
    let sentInviteCountUI = document.getElementById("connection-counter");
    sentInviteCountUI.innerHTML = connectionCount++;
  });

  var startStopButton = document.getElementById("start-stop-button");
  startStopButton.onclick = handleButtonClicked;

  //handle start/stop connect button click
  function handleButtonClicked() {
    chrome.tabs.query(
      { active: true, currentWindow: true },
      onGettingBrowserTabInfo
    );
  }
};

var startSendingInvite = false;

function onGettingBrowserTabInfo(currentTab) {
  let messagePayloadForContentScript = {
    startConnecting: !startSendingInvite,
  };
  startSendingInvite = !startSendingInvite;

  //change botton color & text of button for start/stop state
  if (startSendingInvite) {
    let startStopBtnElement = document.getElementById("start-stop-button");
    startStopBtnElement.style["background-color"] = "#F3B4B3";
    startStopBtnElement.innerHTML = "STOP CONNECTING";
  } else {
    let startStopBtnElement = document.getElementById("start-stop-button");
    startStopBtnElement.style["background-color"] = "#8cc99f";
    startStopBtnElement.innerHTML = "START CONNECTING";
  }
  chrome.tabs.sendMessage(currentTab[0].id, messagePayloadForContentScript);
}
