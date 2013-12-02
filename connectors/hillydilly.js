/*
 * Chrome-Last.fm-Scrobbler hillydilly.com Connector by straiki
 * v1.0, 12-02-2013
 */

var watchedContainer = "#player_bar";

var wait = false;
var song = {};

// bind page unload function to discard current "now listening"

$(window).unload(function() {

    // reset the background scrobbler song data
    chrome.runtime.sendMessage({type: 'reset'});

    return true;
});


var extractDuration = function(context) {
    var duration = 0;

    var time = $('.jp-controls .jp-duration').text().split(':');

    // if there are ever songs that take longer than
    // 1 day to play i'll be happy to update this line
    $.each(time, function(index) {
        var t = parseInt(time[index],10);
        if(index != time.length-1)
            duration += 60*t;
        else
            duration += t;
    });

    return duration;
};

var extractTitle = function(context) {
    var trackContainer = $('.playing_title a', context).text().split('-');

    var track = "", artist = "";
    if(trackContainer.length == 2){
        track = trackContainer[1];
        artist = trackContainer[0];
    }else if(trackContainer.length > 2)
    {
        artist = trackContainer[0];
        var first = true;
        for(var i =0; i < trackContainer.length; i++)
        {
            if (first)
                track += trackContainer[i];
            else
                track += "-" + trackContainer[i];
        }
    }

    return {
        artist: artist,
        track: track
    };
};

var updateNowPlaying = function() {
    var context = watchedContainer;

    var current = extractTitle(context);

    if((!song.artist && !song.track) ||
        song.artist !== current.artist ||
        song.track !== current.track) {
        song = current;
    }

    if(!song.duration || song.duration === 0) {
        song.duration = extractDuration(context);
    } else {
        if(!song.submitted) {
            song.submitted = true;


            chrome.runtime.sendMessage({type: 'validate', artist: song.artist, track: song.track}, function(response) {

                if (response !== false) { // autocorrected song object
                    chrome.runtime.sendMessage({type: 'nowPlaying', artist: response.artist, track: response.track, duration: song.duration});
                } else {
                    chrome.runtime.sendMessage({type: 'nowPlaying', duration: song.duration});
                }

            });
        }
    }

    // reset wait
    wait = false;
};

$(function(){

    $(watchedContainer).live('DOMSubtreeModified', function(e) {
        if(!wait) {
            wait = true;
            setTimeout(updateNowPlaying, 000);
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