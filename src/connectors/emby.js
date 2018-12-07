'use strict';

Connector.playerSelector = '.nowPlayingBar';

Connector.artistSelector = '.nowPlayingBarText .textActionButton[data-type="MusicArtist"]';

Connector.trackSelector = '.nowPlayingBarText .textActionButton[data-type="MusicAlbum"]';

Connector.trackArtSelector = '.nowPlayingBarInfoContainer .nowPlayingImage';

Connector.isPlaying = () => {
	return $('.nowPlayingBarCenter .playPauseButton .md-icon').text() === 'pause';
};

Connector.getCurrentTime = () => {
	let text = $('.nowPlayingBarCenter .nowPlayingBarCurrentTime').text().split('/')[0];
	return Util.stringToSeconds(text);
};

Connector.getDuration = () => {
	let text = $('.nowPlayingBarCenter .nowPlayingBarCurrentTime').text().split('/')[1];
	return Util.stringToSeconds(text);
};

Connector.getAlbum = () => {
	return $('.detailSection .parentName:visible').text() === Connector.getArtist() ? $('.detailSection .itemName:visible').text() : null;
};

Connector.getUniqueID = () => {
	let url = $('.nowPlayingBarInfoContainer .nowPlayingImage').css('background-image');
	return /Items\/(\w+)/g.exec(url)[1];
};

Connector.isStateChangeAllowed = () => {
	// prevents scrobble timer resetting when user changes view while playing a song
	return Connector.getCurrentTime() === 0 || Connector.getCurrentTime() === Connector.getDuration();
};
