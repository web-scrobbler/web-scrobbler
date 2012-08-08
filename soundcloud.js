// TODO:
// - autocorrection,
// - detect titles of the form '<artist> - <title>' and do some kind of
//   smart correction by comparing artist and soundcloud username
//
$(function() {
    // The div.player enclosing the current song.
    var current, validated = false;


    var trackids = {};

    var validate = function(song) {
        chrome.extension.sendRequest(
            {type: 'validate', artist: song.artist, track: song.track},
            function(response) {
                validated = response;
                console.log(current, validated);
                if (!current || validated)
                    return;

                if ($(current).hasClass('set')) {
                    $('li.playing', current).append('<li>(not recognized)</li>');
                }
                else {
                    var stats;
                    if (stats = $('span.stats', current)) {
                        //var notfound = $('<span>not found</span>');
                        stats.prepend('<span>not found</span>');
                        $('span.first').removeClass('first');
                        $('span:first-child').addClass('first');
                    }
                }
            });
    };

    var track = function(context) {
        var player = $(context);
        if (player.hasClass('set'))
            return $('li.playing .info a', player).text();

        else if (title = $('span.soundTitle__title', player).text())
            return title;

        else
            return $('.info-header h3 a, .info-header h1 em', player).text();
    };

    var artist = function(context) {
        var node;
        if (node = $('.info-header a.user-name', context)[0])
            return node.text;

        else if (node = $('a.soundTitle__username', context)[0])
            return node.text;
    };
    var duration = function(context) {
        var node;
        if (node = $('span.duration', context)[0])
            return parseInt($(node).attr('title').substring(2), 10);

        else if (node = $('.timeIndicator__total', context)[0]) {

            // time is given as h.m.s
            var digits = node.text.split(/\D/),
                seconds = 0, length, digit;

            length = digits.length;
            if (length > 3)
                return;

            while (d = digits.pop()) {
                seconds += parseInt(d, 10) * Math.pow(60, length - digits.length - 1);
            }
            return seconds;
        }

    };

    var song = function(context) {
        return {
            'track': track(context),
            'artist': artist(context),
            'duration': duration(context)
        };
    };

    // Track current song by watching which 'a.play' elements get the
    // 'playing' class added to them. Then the closest div.player enclosing
    // this tag will contain elements that describe the current song.
    var check = function(context) {
        // Expect only one element to match 'a.playing'

        var parent;
        parent = $(context).closest('li.set')[0] ||  // 'old' soundcloud
                 $(context).closest('div.player')[0] ||
                 $(context).closest('div.sound.playing')[0];  // 'new' ...

        if (!parent)
            console.log('couldnt get player from', context);
        return (current = parent);
    };

    // Prevent multiple update firings.
    var lock = false;
    var update = function(song) {
        if (lock)
            return;
        lock = true;
        if (validated) {
            console.log('submit', validated.total, validated.artist, validated.song);
        //     chrome.extension.sendRequest(
        //         {type: 'nowPlaying', artist: validated.artist,
        //          track: validated.track, duration: validated.total});
        }
        else {
            chrome.extension.sendRequest({type: 'nowPlaying',
                                          duration: song.duration});
        }
        setTimeout(function() { lock = false; }, 1000);
    };

    var timespan;
    $('.timecodes .editable').live('DOMSubtreeModified', function() {
        var text = $(this).text(), player;
        if (text == '0.01' && timespan != this) {
            timespan = this;
            player = check(timespan);
            if (player)
                validate(song(player));
        }
        else if (validated && timespan == this) {
            var length = $(this).siblings('span.duration').text();
            var curr = parseFloat(text), full = parseFloat(length);
            if (curr && full && (curr / full) >= 0.4) {
                update(current);
                timespan = current = null;
                validated = false;
            }
        }
    });

    // endOfSound

    var timespan;
    $('div.timeIndicator').live('DOMSubtreeModified', function() {
        var self = $(this);
        if (!self.hasClass('playing'))
            return;

        var text = $('div.timeIndicator__current', self);
        if (text == '0.01' && timespan != this) {
            timespan = this;
            player = check(timespan);
            if (player)
                validate(song(player));
        }
        else if (validated && timespan == this) {
            var length = $(this).siblings('span.duration').text();
            var curr = parseFloat(text), full = parseFloat(length);
            if (curr && full && (curr / full) >= 0.4) {
                update(current);
                timespan = current = null;
                validated = false;
            }
        }
    });

    // Alternative to using DOMSubtreeModified; just use setInterval:
    //setInterval(checkPlaying, 1000);

    $(window).unload(function() {
        chrome.extension.sendRequest({type: 'reset'});
        return true;
    });
});
