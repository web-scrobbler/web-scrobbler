/**
 * Chrome-Last.fm-Scrobbler - Ektoplazm connector
 * @author Ben Slote <bslote@gmail.com>
 * Based on the soundcloud connector by Jeppe Hasseriis - https://github.com/cenobitedk
 */

window._ATTACHED = window._ATTACHED || false;

var metadata = {};

function onPlay(data) {
    if (metadata[data.location]) {
        window.postMessage({
            type: 'EKTO_PLAY',
            metadata: metadata[data.location]
        }, '*');
    }
}

function onStop(data) {
    window.postMessage({type: 'EKTO_STOP'}, '*');
}

function onMetadata(data) {
    metadata[data.location] = {artist: data.artist, title: data.title};
    onPlay(data);
}

(function() {
    if (window._ATTACHED) return;

    jQuery(function($) {
        $("*[id^='audioplayer_']").each(function (i, el) {
            AudioPlayer.addListener(el.id, "PLAY", "onPlay");
            AudioPlayer.addListener(el.id, "PAUSE", "onStop");
            AudioPlayer.addListener(el.id, "METADATA", "onMetadata");
        });
    });

    window._ATTACHED = true;
}());

console.log("Ektoplazm connector loaded.");
