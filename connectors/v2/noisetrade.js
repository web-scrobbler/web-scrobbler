
Connector.playerSelector = 'div.jp-playlist';

/**
 * If all the songs contain a hyphen "-", it's more than likely that the album has 
 * various artists and the playlist item text is in the form "Artist - Track".
 *
 * @type {boolean} true if all tracks contain a hyphen, otherwise false
 */
var albumHasVariousArtists = (function () {
    'use strict';
    var all = true;
    /*jslint bitwise: true */
    $('a.jp-playlist-item').each(function () {
        all = all & ($(this).text().indexOf("-") > -1);
    });
    return Boolean(all);
}());

/**
 * Returns true if object is a number, false otherwise
 *
 * @param {object} n
 * @return {boolean} 
 */
function isNumber(n) {
    'use strict';
    return !isNaN(parseFloat(n)) && isFinite(n);
}

/**
 * If all the songs start with at least two numbers, it's more than likely that 
 * the tracks were added with track numbers as part of their title.
 *
 * @type {boolean} true if all tracks start with at least two numbers, otherwise false
 */
var trackTitlesStartWithTrackNo = (function () {
    'use strict';
    var all = true;
    /*jslint bitwise: true */
    $('a.jp-playlist-item').each(function () {
        all = all & (isNumber($(this).text().substring(0, 2)));
    });
    return Boolean(all);
}());

Connector.getArtist = function () {
    'use strict';
    if (albumHasVariousArtists) {
		// return null so getArtistTrack will be used instead
        return null;
    }
	// the position of artist & album were switched but the class names 
	//  weren't updated (artist has class name of "album")
    var text = $('.col_album_titles h2.album a').text().trim();
    return text || null;
};

// the position of artist & album were switched but the class names 
//  weren't updated (album has class name of "artist")
Connector.albumSelector = '.col_album_titles h1.artist';

Connector.getTrack = function () {
    'use strict';
    if (albumHasVariousArtists) {
		// return null so getArtistTrack will be used instead
        return null;
    }
    var track = $('a.jp-playlist-current').text().trim();
    if (trackTitlesStartWithTrackNo) {
        track = track.substring(2);
    }
    return track || null;
};

Connector.getArtistTrack = function () {
    'use strict';
    var itemText = $('a.jp-playlist-current').text().trim(),
        result = /([\w\W]+)\s?-\s?([\w\W]+)/.exec(itemText),
        theArtist;
    if (result) {
        theArtist = result[1].trim();
        if (trackTitlesStartWithTrackNo) {
            theArtist = theArtist.substring(2);
        }
        return {
            artist: theArtist,
            track: result[2].trim()
        };
    }
};

Connector.isPlaying = function () {
    'use strict';
    return Boolean($('img[src*="button-play.png"]')[0]);
};