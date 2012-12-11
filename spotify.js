var listening = false;

$(document).ready(function() {
    chrome.extension.sendRequest({type: 'getOptions'}, function(response) {
       options = response.value;
       init();
    });
});

var current = "";

function init(){

	setInterval(function(){
		if($("#track-name").size() > 0){
			artist = $("#track-artist a").text();
			track = $("#track-name a").text();
			duration = $("#track-length").text();

			d = duration.split(":");
			duration = (d[0] * 60) + (d[1]*1);

			if($("#play-pause").hasClass("playing")){
				if( current != track +"by" + artist+duration){
					current = track +"by"+artist+duration;
					console.log(current);

					chrome.extension.sendRequest({type: 'validate', artist: artist, track: track}, function(response) {
				         // on success send nowPlaying song
				         if (response != false) {
				         	listening = true;
				            var song = response; // contains valid artist/track now
				            // substitute the original duration with the duration of the video
				            chrome.extension.sendRequest({type: 'nowPlaying', artist: song.artist, track: song.track, duration: duration});
				         }
				         // on failure send nowPlaying 'unknown song'
				         else {
				            chrome.extension.sendRequest({type: 'nowPlaying', duration: duration});
				            console.log('Not recognized');
				         }
				   	});
				}

		   	} else{
		   		listening = false;
		   	}
		} else if(listening == true){
			listening = false;
			chrome.extension.sendRequest({type: 'reset'});
		}
	}, 2000);

}

$(window).unload(function() {

  // reset the background scrobbler song data
  if(listening == true){
  	chrome.extension.sendRequest({type: 'reset'});
  }

  return true;
});