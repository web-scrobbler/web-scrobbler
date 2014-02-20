var lastTrack = "";

function updateNowPlaying() {
	var newTrack = $(".active.music > .fnn-title").text();

	if (newTrack != lastTrack) {
		var indexOfSeperator = newTrack.indexOf("-");
		var artist = newTrack.substring(0, indexOfSeperator).trim();
		var song = newTrack.substring(indexOfSeperator+1, newTrack.length);


		chrome.runtime.sendMessage({type: 'validate', artist: artist, track: song}, function(response) {
		// on success send nowPlaying song
			var duration = 180;
		     if (response != false) {
		        var song = response;
		        chrome.runtime.sendMessage({type: 'nowPlaying', artist: song.artist, track: song.track, duration: duration});
		     }
		     // on failure send nowPlaying 'unknown song'
		     else {
		        chrome.runtime.sendMessage({type: 'nowPlaying', duration: duration});
		     }
		     lastTrack = newTrack;
		});
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

             // background calls this to see if the script is already injected
             case 'ping':
                 sendResponse(true);
                 break;
         }
   }
);


addListener();
