
$(function()
{
    var last = null,
        $r = chrome.runtime.sendMessage;

    $(window).unload(function()
    {
        $r({type: 'reset'});
        return true;
    });

    $('.play').bind('DOMSubtreeModified', function()
    {
        var current = $(this).attr('title');
        if (current !== last)
        {
            last = current;

            var m = /^(.*)\s+—\s+(.*?)\s+\((\d+):(\d+)\)$/.exec(current),
                artist = m[1],
                track = m[2],
                duration = parseInt(m[3], 10) * 60 + parseInt(m[4], 10);

            $r({type: 'validate', artist: artist, track: track}, function(response) {
                if (response)
                    $r({type: 'nowPlaying', duration: duration, artist: response.artist, track: response.track});
                else
                    $r({type: 'nowPlaying', duration: duration});
            });
        }
    });
});
