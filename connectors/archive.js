/*
 * Chrome-Last.fm-Scrobbler archive.org Connector by Malachi Soord
 *                (based on George Pollard's bandcamp connctor)
 * v0.1
 */
 var lastTrack = null;
 
$(function(){
    // bind page unload function to discard current "now listening"
    cancel();
});

var durationElapsed = "#jw6_controlbar_elapsed";
var durationTotal = "#jw6_controlbar_duration";
var durationRegex = /(\d+):(\d+)/;

function parseDuration(elapsed, total) {
    try{
        var mEla= durationRegex.exec(elapsed);
        var mTot= durationRegex.exec(total);
        return {current: parseInt(mEla[1],10)*60 + parseInt(mEla[2],10), total: parseInt(mTot[1],10)*60 + parseInt(mTot[2],10)};
    }catch(err){
        return 0;
    }
}

function parseArtist() {
    return $("span.key:contains('Artist/Composer:')").next().text();
}

function parseTitle() {
    var title = $('.playing > .ttl').text();

    // Some titles are stored as artist - track # - title
    var parts = title.split('-');
    if (parts.length > 0 && parts[0] === parseArtist()) {
        // TODO: tighten up this
        title = parts[2];
    }   

    return title;
}

function parseAlbum() {
    var album = $('.x-archive-meta-title').text();
    var parts = album.split('-');

    // Remove artist from album
    if (parts.length > 0 && parts[0].trim() === parseArtist()) {
        album = album.substr(album.indexOf('-') + 1).trim();  
    }

    return album;
}

function cancel(){
    $(window).unload(function() {      
        // reset the background scrobbler song data
        chrome.runtime.sendMessage({type: 'reset'});
        return true;      
    });
}

//console.log('Archive.org: loaded');

$(durationElapsed).live('DOMSubtreeModified', function(e){

    var duration = parseDuration($(durationElapsed).text(), $(durationTotal).text());
    
    //console.log('duration - ' + duration.current + ' / ' + duration.total);

    if(duration.current > 0) { // it's playing

        var artist = parseArtist();
        var track = parseTitle();
        var album = parseAlbum();
        
        if (lastTrack != track)
        {
            lastTrack = track;
            
            //console.log("Archive.org: scrobbling - Artist: " + artist + "; Album:  " + album + "; Track: " + track + "; duration: " + duration.total);
            chrome.runtime.sendMessage({type: 'validate', artist: artist, track: track}, function(response) {
                if (response != false){
                    chrome.runtime.sendMessage({type: 'nowPlaying', artist: response.artist, track: response.track, duration: duration.total, album: album});
                }
                else
                {
                    chrome.runtime.sendMessage({type: 'nowPlaying', duration: duration.total}); 
                }
            });
        }
    }
});
