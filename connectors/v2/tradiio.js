'use strict';

/* global Connector */

Connector.playerSelector = '.leftmusicplayer';

Connector.artistSelector = '.leftmusicplayer .player-artist-name';

Connector.trackSelector = '.leftmusicplayer .musicname a:first';

Connector.playButtonSelector = '.leftmusicplayer .section-controls .btn-play';

Connector.getDuration = function() {
	return Connector.stringToSeconds($('.leftmusicplayer .songDuration').text()) || null;
};

Connector.currentTimeSelector = '.leftmusicplayer .songDuration.s-progress';

Connector.getTrackArt = function () {
	return $('.leftmusicplayer .cover-small img').attr('src').replace('-square.jpg', '-normal.jpg');
};
