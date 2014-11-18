/*
 * Chrome-Last.fm-Scrobbler play.baidu.com Connector
 *
 * Plumes Zhao --- http://blog.summerecho.com --- zhaohonghao2010 at gmail.com
 *
 * Derived from Google Music module by Sharjeel Aziz
 */


// Glabal constant for the song container ....
// State for event handlers
var state = 'init';

// Timeout to scrobble track ater minimum time passes
var scrobbleTimeout = null;


var CONTAINER_SELECTOR = '.album-name a';
var i=1;
var last_url="";
var pause;
//当百度音乐盒右侧边栏中专辑图片下面的专辑名称更新时进行状态更新，
//当加载新歌时，不管专辑是否相同，这个专辑名称都会更新
//this function will be called when the album's name in  right side get changed
$(function(){
	$(CONTAINER_SELECTOR).live('DOMSubtreeModified', function(e) {

		if ($(CONTAINER_SELECTOR)[0].href.length > 0 && $(".songname")[0].href.length > 1 && $(".songname")[0].href !== last_url && $(".album-name a").text() != "--") {

				updateNowPlaying();
				//console.log("Last.fm Scrobbler: starting Baidu Music connector");
				console.log($(".songname")[0].href);
				last_url = $(".songname")[0].href;
				//console.log(i);
				//i=i+1;
				//clearTimeout(pause);
				return;
			
		}

   });

   console.log("Last.fm Scrobbler: starting Baidu Music connector");
   last_url = $(".songname")[0].href;
   // first load
   if(last_url.length > 0) {
   		updateNowPlaying();
   }
   
});

/**
 * Called every time we load a new song
 */
function updateNowPlaying(){
    var parsedInfo = parseInfo();
    artist   = parsedInfo['artist']; 	//global
    track    = parsedInfo['track'];	//global
    album    = parsedInfo['album'];
    duration = parsedInfo['duration']; 	//global

    if (artist == '' || track == '' || duration == 0) {return;}

    // check if the same track is being played and we have been called again
    // if the same track is being played we return
    //if (clipTitle == track) {
	//return;
    //}
    //clipTitle = track;

    chrome.runtime.sendMessage({type: 'validate', artist: artist, track: track}, function(response) {
      if (response != false) {
          chrome.extension.sendMessage({type: 'nowPlaying', artist: artist, track: track, album: album, duration: duration});
      }
      // on failure send nowPlaying 'unknown song'
      else {
         chrome.runtime.sendMessage({type: 'nowPlaying', duration: duration});
      }
    });
}
function parseInfo() {
    var artist   = '';
    var track    = '';
    var album    = '';
    var duration = 0;

    // Get artist and song names
    var artistValue = $(".artist").text();
    var trackValue = $(".songname").text();
    var albumValue = $(".album-name a")[0].text.replace('《','').replace('》','');
    var durationValue = $(".totalTime").text();

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
        if (null != durationValue) {
            duration = parseDuration(durationValue);
        }
    } catch(err) {
        return {artist: '', track: '', duration: 0};
    }
    //console.log("artist: " + artistValue + ", track: " + trackValue + ", album: " + albumValue + ", duration: " + durationValue);
    console.log("artist: " + artist + ", track: " + track + ", album: " + album + ", duration: " + duration);

    return {artist: artist, track: track, album: album, duration: duration};
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
 * Simply request the scrobbler.js to submit song previusly specified by calling updateNowPlaying()
 */
function scrobbleTrack() {
   // stats
   chrome.runtime.sendMessage({type: 'trackStats', text: 'The Baidu Music song scrobbled'});

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
