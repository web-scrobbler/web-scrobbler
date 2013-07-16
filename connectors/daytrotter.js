/*
 * Chrome-Last.fm-Scrobbler for Daytrotter.com "new interface" Connector
 * 
 * Tom Krall - tomkrall[at]gmail[dot]com
 *
 */

console.log('Entered daytrotter.js');

var track;
var artist;
var duration;
var current;

var _flg_Reported;

var container_duration = 'div#jp_interface_1.jp-interface div.jp-duration';
var container_currenttime = 'div#jp_interface_1.jp-interface div.jp-current-time';
var container_mediainfo	= 'div#jp_playlist_1.jp-playlist.single ul.nof li a';
var container_playbutton = 'a.jp-play';		//'div#jp_playlist_1.jp-playlist.single ul.nof.jp-controls li a.jp-pause';
var container_pausebutton = 'a.jp-pause';	//'div#jp_playlist_1.jp-playlist.single ul.nof.jp-controls li a.jp-play';

var _flg_IsPlaying = 0;
var _flg_IsPaused = 0;
var _flg_NeedsToBeReported = 0;
var _flg_HasBeenReported = 0;

function IsPlaying(){
	return _flg_IsPlaying;
}

function IsPaused(){
	return _flg_IsPaused;
}

$(function(){

	console.log("Daytrotter module starting up");

	/*********************************************************************************************************************************

		Monitor the duration container for changines to the track. When the duration changes and is set, it is definitely a new track.

	**********************************************************************************************************************************/
	$(container_duration).live('DOMSubtreeModified', function(e) {
		//console.log("duration modified");

		var tempStr = $(container_mediainfo).text();
		var tempSplit = tempStr.split(" - ", 2);
		var t_artist = tempSplit[0];
		var t_track = tempSplit[1];
		var t_duration = $(container_duration).text();
		var t_current = $(container_currenttime).text();

		//console.log(t_duration);

		if (t_duration != duration && t_duration != "00:00" && t_duration != "" && (t_artist != artist || t_track != track))
		{
			/*
			console.log("new track identified");	
			console.log ("Polling Temp Track Info - DISPLAY[%s] - ARTIST[%s] - TRACK[%s] - CURRENT[%s] - DURATION[%s]",
							tempStr, t_artist, t_track, t_current, t_duration);
			*/

			if (track != t_track || artist != t_artist)
			{
				console.log("new track identified");	

				console.log ("Polling Temp Track Info - DISPLAY[%s] - ARTIST[%s] - TRACK[%s] - CURRENT[%s] - DURATION[%s]",
							tempStr, t_artist, t_track, t_current, t_duration);

				artist = t_artist;
				track = t_track;
				duration = t_duration;

			}
		}
	});

	/*********************************************************************************************************************************

		Monitor the play button to keep track of the "playing" status. It is shown while the pause button is hidden.

	**********************************************************************************************************************************/

	var playElement = $(container_playbutton).get(0); 

	var playObserver = new WebKitMutationObserver(function (mutations) {
		mutations.forEach(attrModified);
	});

	var playConfig = { attributes: true, childList: false, characterData: false };
	playObserver.observe(playElement, playConfig);

	function attrModified(mutation) {
	 	var name = mutation.attributeName,
	    newValue = mutation.target.getAttribute(name),
	    oldValue = mutation.oldValue;

		if (name == "style"  &&  newValue == "display: none;")
		{	
			console.log("play button hidden"); 
		}

		if (name == "style"  &&  newValue == "display: block;")
		{ 
			console.log("play button visible"); 
		}
	}

	/*********************************************************************************************************************************

		Monitor the pause button to keep track of the "pause" status. It is shown while the play button is hidden.

	**********************************************************************************************************************************/

	var pauseElement = $(container_pausebutton).get(0); 

	var pauseObserver = new WebKitMutationObserver(function (mutations) {
		mutations.forEach(attrModified);
	});

	var pauseConfig = { attributes: true, childList: false, characterData: false };
	pauseObserver.observe(pauseElement, pauseConfig);

	function attrModified(mutation) {
	 	var name = mutation.attributeName,
	    newValue = mutation.target.getAttribute(name),
	    oldValue = mutation.oldValue;

		if (name == "style"  &&  newValue == "display: none;")
		{	
			console.log("pause button hidden"); 
		}
		
		if (name == "style"  &&  newValue == "display: block;")
		{ 
			console.log("pause button visible"); 
		}
	}

	/*********************************************************************************************************************************

		Unload

	**********************************************************************************************************************************/
	$(window).unload(function() {     
		console.log('unload');
	
		/*
		chrome.runtime.sendMessage({type: 'reset'});
		return true;      
		*/
	});
});
