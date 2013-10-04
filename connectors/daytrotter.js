/*
 * Chrome-Last.fm-Scrobbler for Daytrotter.com "new interface" Connector
 * 
 * Tom Krall - tomkrall[at]gmail[dot]com
 *
 */

console.log('Entered daytrotter.js');

var mediainfo, track, artist, duration, durationInSeconds;
var album = "Daytrotter Session";
var container_duration = 'div#jp_interface_1.jp-interface div.jp-duration';
var container_currenttime = 'div#jp_interface_1.jp-interface div.jp-current-time';
var container_mediainfo	= 'div#jp_playlist_1.jp-playlist.single ul.nof li a';
var container_pausebutton = 'a.jp-pause';	//'div#jp_playlist_1.jp-playlist.single ul.nof.jp-controls li a.jp-play';
var _flg_IsPaused = false;

function IsPaused(){
	return !_flg_IsPaused;
}

function UpdateMediaInfo( _mediainfo, _artist, _track, _duration){
	//console.log("updating media info");
	mediainfo = _mediainfo;
	artist = _artist;
	track = _track;
	duration = _duration;
	durationInSeconds = CalcSeconds(duration);
}

function CalcSeconds (_duration){
	if (typeof(_duration) == "string" && _duration.indexOf(":") > 0){
		var t = 0;
		var splitTime = _duration.split(":");

		if ( splitTime.length == 3){
			t = ( parseInt(splitTime[0])*60*60 + parseInt(splitTime[1])*60 + parseInt(splitTime[2]) )
		}else if (splitTime.length == 2){
			t = ( parseInt(splitTime[0])*60 + parseInt(splitTime[1]) );
		} else {
			t = -1;
		}
	} else {
		t = -1;
	}

	return t;
}

function PostMediaInfo (){
	//console.log("posting media info");
	chrome.runtime.sendMessage({'type': 'validate', 'artist': artist, 'track': track}, function(response) {
		if (response != false) {
			chrome.runtime.sendMessage({'type': 'nowPlaying', 'artist': artist, 'track': track, 'duration': durationInSeconds});
		} else { // on failure send nowPlaying 'unknown song'
			chrome.runtime.sendMessage({type: 'nowPlaying', 'duration': durationInSeconds});
		}
	});
}


$(function(){
	console.log("Daytrotter module starting up");

	/***********************************************************************************************
	*
	*	Monitor the duration container for changes to the track.
	*
	***********************************************************************************************/
	$(container_duration).live('DOMSubtreeModified', function(e) {
		var t_mediainfo = $(container_mediainfo).text();
		var tempSplit = t_mediainfo.split(" - ", 2);
		var t_artist = tempSplit[0];
		var t_track = tempSplit[1];
		var t_duration = $(container_duration).text();
		var t_current = $(container_currenttime).text();

		// new duration and track/artist info = new song
		if (t_duration != duration && t_duration != "00:00" && t_duration != "" && (t_artist != artist || t_track != track))
		{
			if (track != t_track || artist != t_artist)
			{
				//console.log ("Polling Temp Track Info - PLAYING[%s] - DISPLAY[%s] - ARTIST[%s] - TRACK[%s] - CURRENT[%s] - DURATION[%s]",
				//			!IsPaused(), t_mediainfo, t_artist, t_track, t_current, t_duration);
				UpdateMediaInfo(t_mediainfo, t_artist, t_track, t_duration);
				PostMediaInfo();
			}
		}
	});

	/***********************************************************************************************
	*
	*	Monitor the pause button to keep track of the "pause" status. 
	*
	***********************************************************************************************/
	var pauseElement = $(container_pausebutton).get(0); 

	var pauseObserver = new WebKitMutationObserver(function (mutations) {
		mutations.forEach(attrModified);
	});

	var pauseConfig = { attributes: true, childList: false, characterData: false };
	pauseObserver.observe(pauseElement, pauseConfig);

	function attrModified(mutation) {
		if( mutation.target.style.display == 'none')
		{	
			//console.log("pause button hidden"); 
			_flg_IsPaused = false;
		}
		else
		{
			//console.log("pause button visibile (should be)");
			_flg_IsPaused = true;
		}
	}

	/***********************************************************************************************
	*
	*	Unload
	*
	***********************************************************************************************/
	$(window).unload(function() {     
		//console.log('unload');
		chrome.runtime.sendMessage({'type': 'reset'});
		return true;      
	});
});
