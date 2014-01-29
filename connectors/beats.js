//$.cookie plugin
(function(e){if(typeof define==="function"&&define.amd){define(["jquery"],e)}else{e(jQuery)}})(function(e){function n(e){return u.raw?e:encodeURIComponent(e)}function r(e){return u.raw?e:decodeURIComponent(e)}function i(e){return n(u.json?JSON.stringify(e):String(e))}function s(e){if(e.indexOf('"')===0){e=e.slice(1,-1).replace(/\\"/g,'"').replace(/\\\\/g,"\\")}try{e=decodeURIComponent(e.replace(t," "))}catch(n){return}try{return u.json?JSON.parse(e):e}catch(n){}}function o(t,n){var r=u.raw?t:s(t);return e.isFunction(n)?n(r):r}var t=/\+/g;var u=e.cookie=function(t,s,a){if(s!==undefined&&!e.isFunction(s)){a=e.extend({},u.defaults,a);if(typeof a.expires==="number"){var f=a.expires,l=a.expires=new Date;l.setDate(l.getDate()+f)}return document.cookie=[n(t),"=",i(s),a.expires?"; expires="+a.expires.toUTCString():"",a.path?"; path="+a.path:"",a.domain?"; domain="+a.domain:"",a.secure?"; secure":""].join("")}var c=t?undefined:{};var h=document.cookie?document.cookie.split("; "):[];for(var p=0,d=h.length;p<d;p++){var v=h[p].split("=");var m=r(v.shift());var g=v.join("=");if(t&&t===m){c=o(g,s);break}if(!t&&(g=o(g))!==undefined){c[m]=g}}return c};u.defaults={};e.removeCookie=function(t,n){if(e.cookie(t)!==undefined){e.cookie(t,"",e.extend({},n,{expires:-1}));return true}return false}})
//$.cookie plugin

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