// Used only to remember last song title
var clipTitle = '';


$(function(){
    $('.App_PlayerFooter').live('DOMSubtreeModified', function() {
        updateNowPlaying();
   });

   // first load
   updateNowPlaying();
});

/**
 * Called every time we load a new song
 */
function updateNowPlaying(){
    parseInfo(function(parsedInfo){
        if (parsedInfo.artist == '' || parsedInfo.track == '' || parsedInfo.duration == 0) {
            console.warn('empty artist/track/duration', parsedInfo);
            return;
        }

        // check if the same track is being played and we have been called again
        // if the same track is being played we return
        if (clipTitle == parsedInfo.track) {
            return;
        }
        clipTitle = parsedInfo.track;

        console.log("Now playing -- artist: " + parsedInfo.artist + ", track: " + parsedInfo.track + ", duration: " + parsedInfo.duration);

        chrome.runtime.sendMessage({type: 'validate', artist: parsedInfo.artist, track: parsedInfo.track}, function(response) {
          if (response != false) {
              chrome.extension.sendMessage({type: 'nowPlaying', artist: parsedInfo.artist, track: parsedInfo.track, duration: parsedInfo.duration});
          }
          // on failure send nowPlaying 'unknown song'
          else {
             chrome.runtime.sendMessage({type: 'nowPlaying', duration: parsedInfo.duration});
          }
        });
    });
}


function parseInfo(callback) {
    var artistValue = $(".App_PlayerFooter .player_bottom .artist_title").text().trim();
    var trackValue = $(".App_PlayerFooter .song_title").text().trim();
    var durationValue = $(".App_PlayerFooter .bottom .duration").text().trim();

    callback({
        artist: artistValue,
        track: trackValue,
        duration: parseDuration(durationValue)
    });
}

function parseDuration(duration) {
    var mins = duration.substring(0, duration.indexOf(':'));
    var seconds = duration.substring(duration.indexOf(':') + 1);
    return parseInt(mins * 60) + parseInt(seconds);
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
