'use strict';

Connector.trackArtSelector = "img[alt^='Art for']";

// Due to the way the website is built, I believe we can't really define a selector to access the player directly
// for this reason, I believe the track art to be the closest we can get to the player
Connector.playerSelector = Connector.trackArtSelector;

Connector.pauseButtonSelector = '.icon--pause-circle';

const artistAlbumSeparator = ' by ';

Connector.getArtistTrack = () => {
	// "Art for Layla by Derek & The Dominos"
	const artistAndTrackUnparsed = Util.getAttrFromSelectors(Connector.trackArtSelector, 'alt');

	const artistAndTrackParsed = Util.splitArtistTrack(artistAndTrackUnparsed, [artistAlbumSeparator], { swap: true });

	return artistAndTrackParsed;
};

const filter = MetadataFilter.createFilter({ track: removeTrackPrefix });
Connector.applyFilter(filter);

function removeTrackPrefix(track) {
	return track.replace('Art for ', '');
}

const LIVE_365_ARTIST = 'Live365';
const ADWTAG = 'Advert:';
const ADBREAK = 'Ad Break';

Connector.isScrobblingAllowed = () => {
	const artist = Connector.getArtistTrack().artist;
	return artist !== null
		&& artist !== LIVE_365_ARTIST
		&& artist !== 'undefined'
		&& !artist.includes(ADWTAG)
		&& !artist.includes(ADBREAK);
};

// By overriding this method we can work around the limitation of not being able to do a proper selector for the player
Connector.getObserveTarget = () => {
	// By selecting the parent of the track art, we get something very close to the player, which results in an overall better behaviour
	return document.querySelector(Connector.playerSelector).parentElement;
};
