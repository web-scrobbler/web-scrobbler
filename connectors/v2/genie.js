'use strict';

/* global Connector */

Connector.playerSelector = '#music-player';
Connector.artistSelector = '#ArtistNameArea';
Connector.trackSelector = '#SongTitleArea';
Connector.albumSelector = '#AlbumTilteArea';
Connector.currentTimeSelector = '#playTime span';
Connector.durationSelector = '#playTime strong';

Connector.isPlaying = function() {
	var btn = $('#PlayBtnArea');
	return btn.hasClass('pause'); // if "pause" string in button, it means now playing.
};

Connector.getTrackArt = function() {
	return 'http:'+$('#AlbumImgArea').find('img').attr('src');
};
