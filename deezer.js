/**
 * Chrome-Last.fm-Scrobbler Deezer.com Connector by @damienalexandre
 *
 * The difficulty here is that the song duration can appear a long time after the
 * song start playing.
 * We use the title change to know when a song is played.
 */

var currentDeezerTimeout = null;

$(document).ready(function() {

    sendTrack(); // We maybe have a song playing right away.

    $("title").bind('DOMSubtreeModified', function(e) {

        console.log("Dom changed detected");
        console.log(e);
        currentDeezerTimeout = window.setTimeout(sendTrack, 1000); // As the duration may be not available. And song can be zapped fast.
    });

    $(window).unload(function() {
        cancel();
        return true;
    });
});

function sendTrack()
{
    if (currentDeezerTimeout)
    {
        window.clearTimeout(currentDeezerTimeout);
    }

    var deezerSong = getCurrentTrack();

    if (deezerSong && deezerSong.duration > 0)
    {
        chrome.extension.sendRequest({type: 'validate', artist: deezerSong.artist, track: deezerSong.track}, function(response) {

            console.log('responses from extension');
            if (response != false)
            {
                var song = response; // contains valid artist/track now

                chrome.extension.sendRequest({type: 'nowPlaying', artist: song.artist, track: song.track, duration: deezerSong.duration});
            }
            else
            {
                chrome.extension.sendRequest({type: 'nowPlaying', duration: deezerSong.duration});
                displayMsg('Not recognized');
            }
        });
    }
    else if (currentDeezerTimeout)
    {
        // Retry to fetch the song infos later
        currentDeezerTimeout = window.setTimeout(sendTrack, 1000);
    }
}


function getCurrentTrack()
{
    if ($('#h_play').is(":hidden")) { // Play button hidden, the song is playing
        return {
            track: $('#current-track').html(),
            artist: $('#current-artist').html(),
            duration: parseDuration($('#end-track').html())
        }
    }

    return false;
}

function cancel()
{
    // reset the background scrobbler song data
    chrome.extension.sendRequest({type: 'reset'});
}

/**
 * From 61.js
 *
 * Maybe this kind of common method should be in the Core
 *
 * @param durationString
 */
function parseDuration(durationString){

    console.log(durationString);
	try {
		var match = durationString.match(/\d+:\d+/g);

        if (match)
        {
            mins    = match[0].substring(0, match[0].indexOf(':'));
            seconds = match[0].substring(match[0].indexOf(':')+1);
            return parseInt(mins*60, 10) + parseInt(seconds, 10);
        }
        else
        {
            return 0;
        }
	}
    catch(err)
    {
        throw err;
		return 0;
	}
}