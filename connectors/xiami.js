/*
 * Chrome-Last.fm-Scrobbler www.xiami.com
 *
 *
 * fakelbst myj226[at]gmail.com
 * 2014-03-10
 */
var lastTrack = null;
var currectArtist = null;
var currectSong = null;

function updateNowPlaying(){
    var totalSecondValue = $('#J_durationTime').text();
    if(totalSecondValue){
        var timer = +totalSecondValue.split(':')[0]*60 + +totalSecondValue.split(':')[1];
        duration = timer;
    }
    var parsedInfo = parseInfo();
    artist = parsedInfo['artist'];
    track  = parsedInfo['track'];
    album  = parsedInfo['album'];

    chrome.runtime.sendMessage({type: 'validate', artist: artist, track: track}, function(response) {
        if (response != false) {
            chrome.extension.sendMessage({type: 'nowPlaying', artist: artist, track: track, album: album, duration: duration});
            console.log({type: 'nowPlaying', artist: artist, track: track, album: album, duration: duration});
        }
    });
}

function parseInfo(){
    var artist = currectArtist;
    var track = currectSong;

    var currectAlbum = $('.ui-track-current').children(':first').children('div').eq(2).children('div').eq(2).children(':first').text();

    return {artist: artist, track: track, album: currectAlbum};
}

$(document).ready(function(){
	$(window).unload(function() {
		chrome.runtime.sendMessage({type: 'reset'});
		return true;
	});

    $('#J_trackInfo').live('DOMSubtreeModified', function(e){
        currectSong = $('#J_trackInfo').children('a').eq(0).attr('title');
        currectArtist = $('#J_trackInfo').children('a').eq(1).attr('title');
        var currectTrack = currectArtist + '-' + currectSong;
        if(lastTrack !== currectTrack){
            lastTrack = currectTrack;
            if(currectSong !== undefined && currectArtist !== undefined){
                setTimeout(updateNowPlaying, 1000);
            }
        }
    })

    $('#J_playBtn').click(function(){
        if($('#J_playBtn').attr('class') === 'play-btn'){
            chrome.runtime.sendMessage({type: "reset"});
            lastTrack = '';
            return;
        }
        else{
            setTimeout(updateNowPlaying, 1000);
        }
    });

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
