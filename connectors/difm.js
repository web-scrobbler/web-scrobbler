/**
 * Last.fm Scrobbler for Chrome - Digitally Imported connector
 * @author Daniel Lo Nigro - http://dan.cx/
 *
 * This script runs in the context of di.fm itself. It listens for events fired
 * by their JavaScript, and propagates these events to the extension via
 * `postMessage`.
 */

(function() {
  window.addEventListener('message', function(evt) {
    switch (evt.data.type) {
      case 'DI_TRACK_CHANGE':
        updateNowPlaying(evt.data.metadata);
        break;

      case 'DI_STOP':
        chrome.runtime.sendMessage({type: 'reset'});
        break;
    }
  });

  $(window).unload(function() {
    chrome.runtime.sendMessage({type: 'reset'});
    return true;
  });

  function updateNowPlaying(metadata) {
    chrome.runtime.sendMessage({
      type: 'validate',
      artist: metadata.artist,
      track: metadata.title
    }, function(response) {
      if (response != false) {
        chrome.runtime.sendMessage({
          type: 'nowPlaying',
          artist: response.artist,
          track: response.track,
          duration: metadata.duration
        });
      } else {
        chrome.runtime.sendMessage({
          type: 'nowPlaying',
          duration: metadata.duration
        });
      }
    });
  }

  /**
   * Listen for requests from scrobbler.js
   */
  chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      switch(request.type) {

        // background calls this to see if the script is already injected
        case 'ping':
          sendResponse(true);
          break;
      }
    }
  );
}());
