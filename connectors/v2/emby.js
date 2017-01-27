'use strict';

/* global Connector */

Connector.playerSelector = '.nowPlayingBar';

Connector.artistSelector = '.nowPlayingBarText .textActionButton[data-type="MusicArtist"]';

Connector.trackSelector = '.nowPlayingBarText .textActionButton[data-type="MusicAlbum"]';

Connector.isPlaying = function () {
	return $('.nowPlayingBarCenter .unpauseButton').hasClass('hide');
};

Connector.getCurrentTime = function () {
	var text = $('.nowPlayingBarCenter .nowPlayingBarCurrentTime').text().split('/')[0];
	return this.stringToSeconds(text);
};

Connector.getDuration = function () {
	var text = $('.nowPlayingBarCenter .nowPlayingBarCurrentTime').text().split('/')[1];
	return this.stringToSeconds(text);
};

Connector.getTrackArt = function () {
	// cuts off `url("")` from the background-image property
	return $('.nowPlayingBarInfoContainer .nowPlayingImage').css('background-image').slice(5, -2);
};

Connector.getAlbum = function () {
	return $('.detailSection .parentName:visible').text() === this.getArtist() ? $('.detailSection .itemName:visible').text() : null;
};

Connector.getUniqueID = function () {
	var url = $('.nowPlayingBarInfoContainer .nowPlayingImage').css('background-image');
	return /Items\/(\w+)/g.exec(url)[1];
};

Connector.isStateChangeAllowed = function () {
	// avoids scrobble timer resetting on view change
	return this.getCurrentTime() <= 0;
};
