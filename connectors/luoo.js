/*
 * Chrome-Last.fm-Scrobbler luoo.net(落网)
 *
 * https://github.com/llh911001
 *
 */


var playerContainer = "#playerCt";

function parseInfo(){
    var title  = $(".trackname .PLTrackname").text();
    var artist = $(".track-meta .PLArtist").text();
    var album  =  $(".track-meta .PLAlbum").text();
    var durationArr = $("#PLDuration").find('.total-time').text().split(':');
    var duration    = parseInt(durationArr[0])*60 + parseInt(durationArr[1]);

    return {title: title, artist: artist, album: album, duration: duration};
};


var lastTrack = '';
var isWaiting = 0;

function updateNowPlaying(){
    var data = parseInfo();
    console.log("submitting a now playing request. artist: "+data.artist+", title: "+data.title+", duration: "+data.duration);
    chrome.runtime.sendMessage({type: 'validate', artist: data.artist, track: data.title}, function(response) {
        if (response !== false) {
            chrome.runtime.sendMessage({type: 'nowPlaying', artist: data.artist, track: data.title, duration: data.duration});
        } else { // on failure send nowPlaying 'unknown song'
            chrome.runtime.sendMessage({type: 'nowPlaying', duration: data.duration});
        }
    });
    isWaiting = 0;
}

// Run at startup
$(function(){

    $(playerContainer).live('DOMSubtreeModified', function(e) {
        var data      = parseInfo(),
            newTrack  = data.title + '-' + data.artist;
        if (newTrack !== lastTrack){
            lastTrack = newTrack;
            if(isWaiting === 0){
                isWaiting = 1;
                setTimeout(updateNowPlaying, 1000);
            }
        }
    });

    $(window).unload(function() {
        chrome.runtime.sendMessage({type: 'reset'});
        return true;
    });
});


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
