const NOTIFICATION_TIMEOUT = 5000;

function notify(text) {
  var notification = webkitNotifications.createNotification(
    'icon128.png',  // icon url
    'Chrome Scrobbler',  // notification title
    text  // notification body text
  );
  notification.show();
  setTimeout(function() { notification.cancel() }, NOTIFICATION_TIMEOUT);
}

chrome.extension.onRequest.addListener(
  function(request, sender, sendResponse) {
    switch(request.type) {
    case "notify":
      notify(request.text);
      sendResponse({});
      break;
    }
  }
);
