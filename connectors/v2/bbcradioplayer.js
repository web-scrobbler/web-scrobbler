'use strict';

/* global Connector */
var nowPlayingSelector = '#now-playing .playlister';

Connector.playerSelector = '.programme-details-wrapper';

Connector.artistSelector = nowPlayingSelector + ' .track .artist';

Connector.trackSelector = nowPlayingSelector + ' .track .title';

Connector.getUniqueID = function() {
	return $('#data-uid').text();
};

// Data provided rounds duration UP to next minute... Is usually longer than the last.fm version data.
Connector.getDuration = function () {
	return $('#data-end').text() - $('#data-start').text();
};

Connector.isPlaying = function() {
	return $(nowPlayingSelector).length;
};

// In preparation for merge of PR#607 (https://github.com/david-sabata/web-scrobbler/pull/607)
Connector.getTrackArt = function() {
	var url = $('.radioplayer .playlister.playlister-expanded > img').attr('src');
	return url.indexOf('generictrack') === -1 ? url : null; // Don't use the generic, 'unknown' track art
};
