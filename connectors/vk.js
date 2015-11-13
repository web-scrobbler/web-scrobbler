function scrobble (artist, title, duration) {
    chrome.runtime.sendMessage({type: 'validate', artist: artist, track: title}, function (response) {
        if (response !== false) {
            chrome.runtime.sendMessage({
                type: 'nowPlaying',
                artist: response.artist,
                track: response.track,
                duration: duration
            });
        } else
            chrome.runtime.sendMessage({type: 'nowPlaying'}); // unidentified music
    });
}

$(function () {
    $(window).unload(function () {
        // reset the background scrobbler song data
        chrome.runtime.sendMessage({type: 'reset'});
        return true;
    });

    window.addEventListener('message', function(event) {
        if (event.source != window)
            return;

        if (event.data && event.data.artist && event.data.title && event.data.duration)
            scrobble(event.data.artist, event.data.title, event.data.duration);

    }, false);

    var injectScript = document.createElement('script');
    injectScript.type = 'text/javascript';
    injectScript.src = chrome.extension.getURL('connectors/vk-dom-inject.js');
    (document.head || document.documentElement).appendChild(injectScript);
});


/**
 * Listen for requests from scrobbler.js
 */
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        switch(request.type) {

            // background calls this to see if the script is already injected
            case 'ping':
                sendResponse(true);
                break;
        }
    }
);
