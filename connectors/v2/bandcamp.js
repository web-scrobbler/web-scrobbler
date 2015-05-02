
/** note: the discover page doesn't display the track artist for compilation albums.  This connector 
    currently passes 'Various Artist' (or other variant) as the artist name so tracks on albums with 
    various artists played on the discover page will most likely not be recognized.*/

// wire audio element to fire state changes
$('audio').first().bind('playing pause timeupdate', Connector.onStateChanged);

/**
 * remove zero width characters & trim
 * @param  {string} text to clean up
 * @return {string} cleaned up text
 */
function cleanText(input) {
    'use strict';
    if (input === null) {
        return input;
    }
    return input.replace(/[\u200B-\u200D\uFEFF]/g, '').trim();
}

function getArtist() {
    'use strict';
    var artist = $('.detail_item_link_2').text() ||
                 $('span[itemprop=byArtist]').text() ||
                 null;
    return cleanText(artist);
}

function getTrack() {
    'use strict';
    var track = $('.track_info .title').first().text() ||
                $('.trackTitle').first().text() ||
                null;
    return cleanText(track);
}

function artistIsVarious() {
    'use strict';
    // album page: true if all tracks contain a hyphen or vertical bar (pipe symbol)
    // example of pipe usage: http://tigersmilkrecords.bandcamp.com/album/peru-maravilloso-vintage-latin-tropical-cumbia
    if ($('meta[property="og:type"]').attr('content') === 'album') {
        var allDashed = true;
        $('.track_list span[itemprop="name"]').each(function () {
            if (!/\||-/.test($(this).text())) {
                allDashed = false;
                return false;
            }
        });
        return allDashed;
    }
    // discover & song pages: true if artist name is 'Various' or 'Various Artists' 
    // and track contains a hyphen or vertical bar.
    // Also takes into account misspelling of various as varios
    //    http://krefeld8ung.bandcamp.com/album/krefeld-8ung-vol-1
    return (/^Variou?s(\sArtists)?$/.test(getArtist()) && /\||-/.test(getTrack()));
}

/* @returns {{artist, track}} */
Connector.getArtistTrack = function () {
    'use strict';
    var artist = getArtist(),
        track = getTrack(),
        separatorIndex;
    if (artistIsVarious()) {
        separatorIndex = Math.max(track.indexOf('-'), track.indexOf('|'));
        artist = track.substring(0, separatorIndex);
        track = track.substring(separatorIndex + 1);
    }
    return {
        artist: artist,
        track: track
    };
};

Connector.getAlbum = function () {
    'use strict';
    var album = $('.detail_item_link').text() ||
                $('h2.trackTitle').text() ||
                $('[itemprop="inAlbum"] [itemprop="name"]').text() ||
                null;
    return cleanText(album);
};

Connector.playButtonSelector = 'div.playbutton:not(.playing)';

Connector.currentTimeSelector = 'span.time_elapsed';

Connector.getDuration = function () {
    'use strict';
    return Math.round($('audio')[0].duration);
};
