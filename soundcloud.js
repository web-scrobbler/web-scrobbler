(function() {
    var options;
    var current = {};

    var song = function(ptitle) {
        var title = ptitle.split(' by ');
        var trackInfo = title[0].replace(/"|\[|\]/g, '').split(' - ');
        if (!trackInfo[1])
            trackInfo = [title[1], trackInfo[0]];
        else
            trackInfo[0] = trackInfo[0]

        return {
            artist: trackInfo[0],
            track: trackInfo[1],
            duration: duration(title[0])
        };
    };

    var duration = function(title) {
        node = $('.sound.playing').not('.playlist').find('.timeIndicator__total');
        if (node.length) {
            // time is given as h.m.s
            var digits = node[0].innerHTML.split(/\D/),
                seconds = 0, length, digit;

            length = digits.length;
            if (length > 3)
                return;

            while (digits.length) {
                d = digits.pop();
                seconds += parseInt(d, 10) * Math.pow(60, length - digits.length - 1);
            }
            return seconds;
        }
        // if unknown duration, assume 2 minutes
        return 120;
    };

    $(document).ready(function() {
        var current_title = '';
        $('title').live('DOMSubtreeModified', function() {
            var title = $(this).text();
            if (title[0] !== '▶' || current_title === title)
                return;
            current_title = title;
            setTimeout(function () {
                var s = song(title.substr(2));

                chrome.extension.sendRequest({type: 'validate',
                                            artist: s.artist,
                                             track: s.track},
                function(response) {
                    current.validated = response;
                    if (response !== false) {
                        chrome.extension.sendRequest({type: 'nowPlaying',
                                                    artist: response.artist,
                                                     track: response.track,
                                                  duration: s.duration});
                    }

                    else {
                        chrome.extension.sendRequest({type: 'nowPlaying',
                                                  duration: s.duration});
                    }
                });
            }, 500);
        });
    });

    $(window).unload(function() {
        chrome.extension.sendRequest({type: 'reset'});
        return true;
    });
})();
