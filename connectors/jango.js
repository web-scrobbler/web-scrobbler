/*
 * Chrome-Last.fm-Scrobbler jango.com connector
 * (c) 2012 Stephen Hamer <stephen.hamer@gmail.com>
 */

// Used to cache the song title to prevent repeated calls to updateNowPlaying
var lastSongTitle = '';

function updateNowPlaying() {
  var commDiv = document.getElementById('chromeLastFM');
  try {
    var songInfo = JSON.parse(commDiv.innerText);
  } catch (e) {
    // Skip malformed communication blobs
    return;
  }

  if (songInfo['title'] == lastSongTitle) {
    return;
  }
  lastSongTitle = songInfo['title'];

  // Update scrobbler
  console.log('submitting a now playing request. artist: ' + songInfo['artist'] + ', title: ' + songInfo['title'] + ', duration: ' + songInfo['duration']);
  chrome.runtime.sendMessage({'type': 'validate', 'artist': songInfo['artist'], 'track': songInfo['title']}, function(response) {
    if (response != false) {
      chrome.runtime.sendMessage({type: 'nowPlaying', 'artist': songInfo['artist'], 'track': songInfo['title'], 'duration': songInfo['duration']});
    } else {
      // on validation failure send nowPlaying 'unknown song'
      chrome.runtime.sendMessage({'type': 'nowPlaying', 'duration': songInfo['duration']});
    }
  });
}

// Run at startup, inject hooks into Jango application javascript to catch song changes.
$(document).ready(function(){
  console.log('Jango module starting up');

  // XXX(shamer): we can't directly access the page javascript from the
  // extension. To get code running in the page context we have to add a script tag
  // to the DOM. The script then is executed in the global context.
  // To communicate between the injected JS and the extension a DOM node is updated with the text to send.

  var comNode = $('<div id="chromeLastFM" style="display: none"><span id="title"></span><span id="artist"></span><span id="duration"></span></div>');
  document.body.appendChild(comNode[0]);

  $('body').append('<script type="text/javascript">(function(l) {\n' +
"    var injectScript = document.createElement('script');\n" +
"    injectScript.type = 'text/javascript';\n" +
"    injectScript.src = l;\n" +
"    document.getElementsByTagName('head')[0].appendChild(injectScript);\n" +
"  })('" + chrome.extension.getURL('connectors/jango-dom-inject.js') + "');</script>");

  // Listen for 'messages' from the injected script
  $('#chromeLastFM').live('DOMSubtreeModified', updateNowPlaying);

  $(window).unload(function() {
    chrome.runtime.sendMessage({type: 'reset'});
    return true;
  });
});
