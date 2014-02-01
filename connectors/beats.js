// State for event handlers
var state = 'init';

// Used only to remember last song title
var clipTitle = '';

// Timeout to scrobble track after minimum time passes
var scrobbleTimeout = 30;

// Glabal constant for the song container ....

var CONTAINER_SELECTOR = "#app__transport .transport__detail";
var ALBUM_SELECTOR = "#app__transport .transport__art";

$(function(){
	$("title").live('DOMSubtreeModified', function(e) {
		if ($(CONTAINER_SELECTOR).length > 0) {
			updateNowPlaying();
			return;
		}
   });
   updateNowPlaying();
});

/**
 * Called every time we load a new song
 */
function updateNowPlaying(){
	var callback = function(parsedInfo) {
		artist   = parsedInfo['artist']; 	//global
		track    = parsedInfo['track'];	//global
		album    = parsedInfo['album']; //Not available
		//duration = parsedInfo['duration']; //Not available	//global

		if (artist == '' || track == '') {return;}

		// check if the same track is being played and we have been called again
		// if the same track is being played we return
		if (clipTitle == track) {
			return;
		}
		clipTitle = track;

		chrome.runtime.sendMessage({type: 'validate', artist: artist, track: track, album: album}, function(response) {
		  if (response != false) {
			  chrome.extension.sendMessage({type: 'nowPlaying', artist: artist, track: track, album: album});
			  console.log({type: 'nowPlaying', artist: artist, track: track, album: album});
		  }
		  // on failure send nowPlaying 'unknown song'
		  else {
			 chrome.runtime.sendMessage({type: 'nowPlaying', duration: duration});
		  }
		});
	}

	parseInfo(callback);
}


function parseInfo(callback) {
    $detail = $(CONTAINER_SELECTOR + " > .artist-track-target");
	$album = $("#t-art");

	var authToken = "Bearer " + $.cookie("access_token");

	var albumArtLink = $album.css("background-image");

	if (albumArtLink.length === 0) {
		return;
	}


	var urlParts = albumArtLink.split("/");

	var albumApiUrl = "https://api.beatsmusic.com/api/albums/" + urlParts[5];

    $.ajax({
		type:"GET",
		beforeSend: function (request)
		{
			request.setRequestHeader("Authorization", authToken);
		},
		url: albumApiUrl,
		success: function(msg) {

			var artist   = '';
			var track    = '';
			var album    = '';
			var duration = 0;

			// Get artist and song names
			var artistValue = $detail.find(".artist").text();
			var trackValue = $detail.find(".track").text();
			var albumValue = msg.data.title;

			//var durationValue = Not available at this time

			try {
				if (null != artistValue) {
					artist = artistValue.replace(/^\s+|\s+$/g,'');
				}
				if (null != trackValue) {
					track = trackValue.replace(/^\s+|\s+$/g,'');
				}
				 if (null != albumValue) {
					 album = albumValue.replace(/^\s+|\s+$/g,'');
				 }
				// if (null != durationValue) {
					// duration = parseDuration(durationValue);
				// }
			} catch(err) {
				callback({artist: '', track: '', album: '', duration: 0});
			}
			var parsedInfo = {
				artist: artist,
				track: track,
				album: album,
				duration: 0
			}
			callback(parsedInfo);
		}
    });
}

function parseDuration(artistTitle) {
	try {
		match = artistTitle.match(/\d+:\d+/g)[0]

		mins    = match.substring(0, match.indexOf(':'));
		seconds = match.substring(match.indexOf(':')+1);
		return parseInt(mins*60) + parseInt(seconds);
	} catch(err){
		return 0;
	}
}

/**
 * Simply request the scrobbler.js to submit song previously specified by calling updateNowPlaying()
 */
function scrobbleTrack() {
   // stats
   chrome.runtime.sendMessage({type: 'trackStats', text: 'The Beats Music song scrobbled'});

   // scrobble
   chrome.runtime.sendMessage({type: 'submit'});
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