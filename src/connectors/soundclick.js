'use strict';

const filter = new MetadataFilter({
	track: cleanupTrack
});

Connector.playerSelector = '#playerWrap';

Connector.artistSelector = '#playerSCLK_artistName';

// use playlist to get track title
// to avoid missing content when quotation marks present
Connector.getTrack = () => {
	const text = Util.getTextFromSelectors('.songActive .playlist-songtitle');
	const artist = Connector.getArtist();
	return text.substr(text.match(artist).index + artist.length + 3);
};
Connector.applyFilter(filter);

function cleanupTrack(text) {
	return text.replace(/^\*[^*]+\*/, '').replace(/([(*]|- )?buy \d+ get \d+ .*$/i, '').trim();
}

Connector.playButtonSelector = '#btnPlay';

Connector.currentTimeSelector = '#currentTime';

Connector.durationSelector = '#totalTime';

Connector.trackArtSelector = '#playerSCLK_songPicture';

Connector.isTrackArtDefault = (trackArtUrl) => {
	return trackArtUrl.includes('/images/brand/logo_dark.svg');
};

Connector.getUniqueID = () => {
	return Util.getAttrFromSelectors('#playerWrap', 'data-songid');
};
