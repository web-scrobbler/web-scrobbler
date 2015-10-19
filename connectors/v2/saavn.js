/**
 * Chrome-Last.fm-Scrobbler - Gaana.com Connector
 *
 * Author: Sitesh Shrivastava [siteshshrivastava@gmail.com]
 * Changes : Vishal Ithape [vishal8492@gmail.com]
 */

// DOM Nodes to keep track for song details
var SONG_TRACK_NAME = '#player-track-name';
var SONG_ALBUM_NAME = '#player-album-name';
var SONG_DURATION_DOM = '#track-time';

Connector.playerSelector = '#now-playing';

// Prevent same track from being scrobbled continuously
var previousTrack = '';

// Get track name
function getTrack() {
    var trackName = $(SONG_TRACK_NAME + ' a').text();
	if (!trackName) {
		return ;
 	}

    return trackName;
}

var prevUrl = "";

//To get artist name by ajax
function updateNowPlaying() {
    var track = getTrack();
    var duration = getDuration();

    var track_url = $(SONG_TRACK_NAME + ' a');
    var url = track_url.attr("onclick");
    url = url.replace("Util.logAndGoToUrl('site:player:track-name:click', '", "");
    url = url.replace("');", "");

    if(url == prevUrl){
        return;
    }
    else{
        prevUrl = url;
    }
    $.ajax({
      url: url,
      context: document.body,
    }).done(function(data) {

        var start = data.indexOf('<meta property="music:musician" content="http://www.saavn.com/s/artist/') + '<meta property="music:musician" content="http://www.saavn.com/s/artist/'.length;
        data = data.substring(start);
        data = data.substring(0, data.indexOf('-albums'));
        var artist = data.split("-").join(" ");
        console.log('Validating: ' + artist + ' @#@ ' + track + ' @#@ ' + duration);

        if (!artist || !track) {
            return;
        }
        if (previousTrack == track) {
            return;
        }

        previousTrack = track;

        console.log('Validating: ' + artist + ' @#@ ' + track + ' @#@ ' + duration);

        chrome.runtime.sendMessage({type: 'validate', artist: artist, track: track}, function (response) {
            if (response != false) {
                console.log('Success: ' + artist + ' - ' + track + ' - ' + duration);
                chrome.runtime.sendMessage({type: 'nowPlaying',
                    artist: response.artist,
                    track: response.track,
                    duration: response.duration / 1000
                });
            } else {
                console.log('Failure: ' + duration);
                chrome.runtime.sendMessage({
                    type: 'nowPlaying',
                    duration: duration
                });
            }
        });


    });
}

// Get track length
function getDuration() {
	if (!$(SONG_DURATION_DOM)) {
		return;
	}

    var duration = $(SONG_DURATION_DOM).text().split(':');
    return 60 * parseInt(duration[0]) + parseInt(duration[1]);
}


console.log('Saavn.com connector loading');

// Track enclosing <div>, id: 'now-playing' to observe track change
$('#now-playing').on('DOMSubtreeModified', function () {
    setTimeout(updateNowPlaying, 5000);
});

// Reset in case of crash / mishap
$(window).unload(function () {
    chrome.runtime.sendMessage({
        type: 'reset'
    });
    return true;
});

/**
 * Listen for requests from scrobbler.js
 */
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        switch (request.type) {

            // background calls this to see if the script is already injected
            case 'ping':
                sendResponse(true);
                break;
        }
    }
);

console.log('Saavn.com connector loaded');
