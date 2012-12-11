/*
Chrome-Last.fm-Scrobbler iHeartRadio Connector
*/
var track, artist, duration
var scrobbleTimeout = null;
var durationTimeout = null;
$(function () {
    //setup unload handler
    $(window).unload(function () {
        //reset the background scrobbler song data
        chrome.extension.sendRequest({
            type: 'reset'
        });
        return true;
    });
    $("#playerPlay,.b-playStation").click(function () {
        var c = 0;
        //wait for changes in artist name
        $("#player h2.artist").bind("DOMSubtreeModified", function (e) {      
            //avoids being executed twice
            if (c == 0) {
                c++;
                return false;
            }
            //cancel any previous timeout
            if (scrobbleTimeout != null) clearTimeout(scrobbleTimeout);
            if (durationTimeout != null) clearTimeout(durationTimeout);
            //delay notification slightly
            setTimeout(function () {
                artist = $("#player h2.artist a").attr("title");
                track = $("#player h1.title a").attr("title");
                duration = $(".songDuration").text();
            }, 1000);
            displayMsg()
            //song duration on page updates as the music gets loaded by the browser
            waitForDuration(updateNowPlaying);
            c = 0;
        })
    })
});

function updateNowPlaying() {
    if (artist == "" || track == "" || artist == undefined || track == undefined) {
        console.log("Artist/Track was empty or radio station is in a commercial break.");
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
            console.log("Last.fm was unable to validate the Artist/Track combination.");
        }
    });
}

function waitForDuration(callback) {
    function getDuration() {
        var current_track_duration = $(".songDuration").text();
        //need a new solution for duration on live stations
        if (current_track_duration == "0:00" || current_track_duration == "") {
        current_track_duration = "0:00 / 3:00";
        }
        var total_length = current_track_duration.split(" / ")[1];
        return parseInt(total_length.split(":")[0] * 60) + parseInt(total_length.split(":")[1]);
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
    $("#chrome-scrobbler-status").remove();
}