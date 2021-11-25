//listen for events from chrome extention's background sctipts
chrome.runtime.onMessage.addListener(gotMessage);

var connectButtonList = [];
var i = 0;
var modalSendBtnElement = [];

//callback for above event listener
//checks for a specific message from background script and changes page concepts
function gotMessage(message, sender, sendResponse) {
  console.log(message.startConnecting);

  if (message.startConnecting === true) {
    var buttons = document.getElementsByTagName("button");
    for (btn of buttons) {
      btn.style["border"] = "1px solid #1890ff";
    }

    //check and push all connect  button element in one array
    for (let i = 0; i <= buttons.length; i++) {
      if (buttons[i] !== undefined) {
        if (buttons[i].lastChild.innerText === "Connect") {
          connectButtonList.push(buttons[i]);
        }
      }
      console.log("connectButtonList prepared");
    }

    i = 0; //reset counter
    sendConnectRequestLoop(); //  start the loop
  } else {
    connectButtonList = [];
    modalSendBtnElement = [];
  }

  //Loop through NodeList and call the click() function on each button
  function sendConnectRequestLoop() {
    setTimeout(function () {
      if (connectButtonList[i] !== undefined) {
        if (connectButtonList[i].lastChild.innerText === "Connect") {
          //click the button
          connectButtonList[i].click();

          setTimeout(() => {
            var modalSendBtnElement = document.querySelectorAll(
              '[aria-label="Send now"]'
            );
            console.log(modalSendBtnElement);
            if (
              modalSendBtnElement !== null &&
              modalSendBtnElement !== undefined
            ) {
              console.log(modalSendBtnElement[0]);
              modalSendBtnElement[0].click();
            }
            modalSendBtnElement = [];
          }, 2000);

          chrome.runtime.sendMessage(
            {
              connectionCount: i + 1,
            },
            function (response) {
              console.dir(response);
            }
          );
        }
      }
      i++;
      if (i <= connectButtonList.length) {
        sendConnectRequestLoop();
      }
    }, 5000);
  }
}

function gotTabInfoCallback() {
  console.log("got tabs data", tab);
  console.log("sending message");
  let messagePayload = {
    txt: "hello from content.js",
  };
  chrome.runtime.sendMessage(tab[0].id, messagePayload);
}
