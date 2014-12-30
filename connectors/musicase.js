/*
 * Chrome-Last.fm-Scrobbler http://musicase.me/
 *
 * joe50261[at]gmail.com
 * 2014-12-30
 * 
 * Based on 163music.js by fakelbst
 */
var lastTrack = null;
var currectArtist = null;
var currectSong = null;

function updateNowPlaying(){
    /* Duration is not implemented*/
    var parsedInfo = parseInfo();
    artist = parsedInfo['artist'];
    track  = parsedInfo['track'];
    album  = parsedInfo['album'];

    chrome.runtime.sendMessage({type: 'validate', artist: artist, track: track}, function(response) {
        if (response != false) {
            chrome.extension.sendMessage({type: 'nowPlaying', artist: artist, track: track, album: album});
        }
    });
}

function parseInfo(){
    var artist = currectArtist;
    var track = currectSong;
    var album = currectAlbum;
    return {artist: artist, track: track, album: album};
}

$(document).ready(function(){
	$(window).unload(function() {
		chrome.runtime.sendMessage({type: 'reset'});
		return true;
	});

    $('#areaNotification').live('DOMSubtreeModified', function(e){
        currectSong =   $('#blockInfo').children()[0].text;
        currectArtist = $('#blockInfo').children()[1].text;
        currectAlbum =  $('#blockInfo').children()[2].text;
        var currectTrack = currectArtist + '-' + currectSong;
        if(lastTrack !== currectTrack){
            lastTrack = currectTrack;
            if(currectSong !== undefined && currectArtist !== undefined){
                setTimeout(updateNowPlaying, 1000);
            }
        }
    })

    

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
