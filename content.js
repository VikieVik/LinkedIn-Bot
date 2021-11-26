var connectButtonList = [];
var btnIndex = 0;
var confirmationModalSendButton = [];

//listen for messages from popup.js
chrome.runtime.onMessage.addListener(onGettingMessageFromPopup);

//callback for above event listener
//checks for a specific message from background script get connect buttons from DOM
function onGettingMessageFromPopup(message, sender, sendResponse) {
  if (message.startConnecting === true) {
    var allButtonsOnWebsite = document.getElementsByTagName("button");

    //get connect buttons & save into connectButtonList[]
    for (let i = 0; i <= allButtonsOnWebsite.length; i++) {
      if (allButtonsOnWebsite[i] !== undefined) {
        if (allButtonsOnWebsite[i].lastChild.innerText === "Connect") {
          connectButtonList.push(allButtonsOnWebsite[i]);
        }
      }
    }
    sendConnectRequestLoop();
  } else {
    connectButtonList = [];
    confirmationModalSendButton = [];
  }

  //Click all connect button with 5 sec delay
  function sendConnectRequestLoop() {
    setTimeout(() => {
      if (connectButtonList[btnIndex] !== undefined) {
        if (connectButtonList[btnIndex].lastChild.innerText === "Connect") {
          //click the button
          connectButtonList[btnIndex].click();

          //wait 2 sec and click send now button of confirmation popup
          setTimeout(() => {
            var confirmationModalSendButton = document.querySelectorAll(
              '[aria-label="Send now"]'
            );
            if (
              confirmationModalSendButton !== null &&
              confirmationModalSendButton !== undefined &&
              confirmationModalSendButton.length > 0
            ) {
              confirmationModalSendButton[0].click();
              sendConnectBtnClickConfirmationToPopup();
            }
            confirmationModalSendButton = [];
          }, 2000);
        }
      }
      btnIndex++;
      if (btnIndex <= connectButtonList.length) {
        sendConnectRequestLoop();
      }
    }, 5000);
  }

  function sendConnectBtnClickConfirmationToPopup() {
    chrome.runtime.sendMessage(
      {
        connectConfirmation: "connect invite sent",
      },
      function (response) {
        //console.dir(response);
      }
    );
  }
}
