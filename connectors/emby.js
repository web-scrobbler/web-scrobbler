'use strict';

/* global Connector */

Connector.playerSelector = '.nowPlayingBar';

Connector.artistSelector = '.nowPlayingBarText .textActionButton[data-type="MusicArtist"]';

Connector.trackSelector = '.nowPlayingBarText .textActionButton[data-type="MusicAlbum"]';

Connector.trackArtSelector = '.nowPlayingBarInfoContainer .nowPlayingImage';

Connector.isPlaying = function () {
	return $('.nowPlayingBarCenter .playPauseButton .md-icon').text() === 'pause';
};

Connector.getCurrentTime = function () {
	var text = $('.nowPlayingBarCenter .nowPlayingBarCurrentTime').text().split('/')[0];
	return this.stringToSeconds(text);
};

Connector.getDuration = function () {
	var text = $('.nowPlayingBarCenter .nowPlayingBarCurrentTime').text().split('/')[1];
	return this.stringToSeconds(text);
};

Connector.getAlbum = function () {
	return $('.detailSection .parentName:visible').text() === this.getArtist() ? $('.detailSection .itemName:visible').text() : null;
};

Connector.getUniqueID = function () {
	var url = $('.nowPlayingBarInfoContainer .nowPlayingImage').css('background-image');
	return /Items\/(\w+)/g.exec(url)[1];
};

Connector.isStateChangeAllowed = function () {
	// prevents scrobble timer resetting when user changes view while playing a song
	return this.getCurrentTime() === 0 || this.getCurrentTime() === this.getDuration();
};
