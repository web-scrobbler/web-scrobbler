/*
 * Chrome-Last.fm-Scrobbler music.163.com
 *
 *
 * fakelbst myj226[at]gmail.com
 * 2014-08-01
 */
var lastTrack = null;
var currectArtist = null;
var currectSong = null;

function updateNowPlaying(){
    var totalSecondValue = $('#g_player').find('.time').text();
    if(totalSecondValue){
        totalSecondValue = totalSecondValue.substr(totalSecondValue.length-4);
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
        }
    });
}

function parseInfo(){
    var artist = currectArtist;
    var track = currectSong;
    return {artist: artist, track: track};
}

$(document).ready(function(){
	$(window).unload(function() {
		chrome.runtime.sendMessage({type: 'reset'});
		return true;
	});

    $('.j-flag').live('DOMSubtreeModified', function(e){
        currectSong = $('.fc1').text();
        currectArtist = $('.by').children('span').attr('title');
        var currectTrack = currectArtist + '-' + currectSong;
        if(lastTrack !== currectTrack){
            lastTrack = currectTrack;
            if(currectSong !== undefined && currectArtist !== undefined){
                setTimeout(updateNowPlaying, 1000);
            }
        }
    })

    $('.ply').click(function(){
        console.log(this);
        if($(this).attr('class') === 'ply pas'){
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
