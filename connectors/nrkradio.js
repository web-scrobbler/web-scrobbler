var lastTrack = "";

function updateNowPlaying() {
	var newTrack = $(".active.music > .fnn-title").text();

	if (newTrack != lastTrack) {
		lastTrack = newTrack;
		var indexOfSeperator = newTrack.indexOf("-");
		var artist = newTrack.substring(0, indexOfSeperator).trim();
		var song = newTrack.substring(indexOfSeperator+1, newTrack.length).trim();
        if(artist.length > 0 && song.length > 0)
		{
			var artistsSeperatorReplaced = artist.replace(/\s\+/g, ",");
			chrome.runtime.sendMessage({type: 'validate', artist: artistsSeperatorReplaced, track: song}, function(response) {
			     if (response != false) {
			        var song = response;
			        chrome.runtime.sendMessage({type: 'nowPlaying', artist: song.artist, track: song.track, duration: song.duration/1000});
			     }
			     else {
			        chrome.runtime.sendMessage({type: 'nowPlaying', duration: 0});
			     }

			});
		}
	};
}

var addListener = function() {
	$("#live").live("DOMSubtreeModified", function(e) {
    	if ($(".active.music").length > 0)
    	{		
	    	setTimeout(updateNowPlaying, 500);
		}
	});
}

$(function() {
    $(window).unload(function() {
		chrome.runtime.sendMessage({type: 'reset'});
		return true;
    });
});

chrome.runtime.onMessage.addListener(
   function(request, sender, sendResponse) {
         switch(request.type) {
             case 'ping':
                 sendResponse(true);
                 break;
         }
   }
);

addListener();