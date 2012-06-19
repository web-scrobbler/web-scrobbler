/*
Chrome-Last.fm-Scrobbler iHeartRadio Connector
*/
var track, artist, album, duration
var scrobbleTimeout = null;
var durationTimeout = null;

$(function () {

    //setup unload handler
    $(window).unload(function () {
        // reset the background scrobbler song data
        chrome.extension.sendRequest({
            type: 'reset'
        });
        return true;
    });


//keep track of skips
$('#loading').text("0 songs");
$('#playerNext').click(function() {
    $('#loading').text(parseInt($('#loading').text()) + 1).append(" skips").css('display','block');
});

    //Start when user clicked play... need to listen for other event handler on page as well in future version
	$("#playerPlay,.b-playStation").click(function(){
        //Listen for change in result div
        var c = 0;
        //Wait for changes in artist name
        $('#player h2.artist').bind('DOMSubtreeModified', function (e) {

            //HTML changed, NEW SONG!!!
            //The jquery dom bind gets triggerd two times, this is to avoid the code from being executed twice.
            if (c == 0) {
                c++;
                return false;
            }

            // cancel any previous timeout
            if (scrobbleTimeout != null) clearTimeout(scrobbleTimeout);
            if (durationTimeout != null) clearTimeout(durationTimeout);

            //dom takes a second to update, delay notification and submission to lastfm slightly
            setTimeout(function () {
            artist = $("#player h2.artist a").attr("title");
            track = $("#player h1.title a").attr("title");
            duration = $(".songDuration").text();
            }, 1000);

            displayMsg()

            //Song duration on page updates as the music gets loaded by the browser. Might take a while before you get a fixed duration for the track. waitForDuration checks if the track duration has not changed in a while (the track should then be fully loaded)
            waitForDuration(updateNowPlaying); 

            c = 0;

        })
    })
});

function updateNowPlaying() {
    if (artist == '' || track == '' || artist == undefined || track == undefined) {
        console.log("Artist or track was empty or station is in a commercial break");
        return;
    }
    //validate track info
    chrome.extension.sendRequest({
        type: 'validate',
        artist: artist,
        track: track
    }, function (response) {
        if (response != false) {

            chrome.extension.sendRequest({
                type: 'nowPlaying',
                artist: artist,
                track: track,
                duration: duration
            });

            console.log({
                type: 'nowPlaying',
                artist: artist,
                track: track,
                duration: duration
            });

            displayMsg("Scrobbling");

        } else {
          displayMsg("Unable to Scrobble");
          console.log("Artist/Track combination couldn't be validated.");
        }

    });
}

function waitForDuration(callback) {

    function getDuration() {
        var duration_el = $(".songDuration").text();
        if (duration_el == "loading..." || duration_el == "0:00" || duration_el == "") return false;
        var total_length = duration_el.split(" / ")[1];
        return parseInt(total_length.split(":")[0] * 60) + parseInt(total_length.split(":")[1]); // turn something like 5:50 into seconds
    }

    var check_1 = getDuration();

    durationTimeout = setTimeout(function () {

        var check_2 = getDuration();
        if (check_1 == check_2 && check_1 != false && check_1 != 0) {
            //not loading anymore
            duration = check_1;
            callback();
        } else {
            waitForDuration(callback);
        }
    }, 1000);


}

function displayMsg(msg) {

    $('#chrome-scrobbler-status').remove();

}