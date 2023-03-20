'use strict';

const filter = MetadataFilter.createFilter({
	track: cleanupTrack,
});

Connector.playerSelector = '#playerWrap';

Connector.artistSelector = '#playerSCLK_artistName';

Connector.trackSelector = '.songActive .playlist-songtitle';
Connector.applyFilter(filter);

function cleanupTrack(text) {
// use playlist to get track title removing artist name
// to avoid missing content when quotation marks present
	const artist = Connector.getArtist();
	return text.substr(text.match(artist).index + artist.length + 3)
		.replace(/^\*[^*]+\*/, '')
		.replace(/([(*]|- )?buy \d+ get \d+ .*$/i, '');
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
