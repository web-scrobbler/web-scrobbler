export {};

Connector.trackArtSelector = "img[alt^='Art for']";

// Due to the way the website is built, I believe we can't really define a selector to access the player directly
// for this reason, I believe the track art to be the closest we can get to the player
Connector.playerSelector = Connector.trackArtSelector;

Connector.pauseButtonSelector = '.icon--pause-circle';

const artistAlbumSeparator = ' by ';

Connector.getArtistTrack = () => {
	// "Art for Layla by Derek & The Dominos"
	const artistAndTrackUnparsed = Util.getAttrFromSelectors(
		Connector.trackArtSelector,
		'alt',
	);

	const artistAndTrackParsed = Util.splitArtistTrack(
		artistAndTrackUnparsed,
		[artistAlbumSeparator],
		true,
	);

	return artistAndTrackParsed;
};

const filter = MetadataFilter.createFilter({ track: removeTrackPrefix });
Connector.applyFilter(filter);

function removeTrackPrefix(track: string) {
	return track.replace('Art for ', '');
}

const LIVE_365_ARTIST = 'Live365';
const ADWTAG = 'Advert:';
const ADBREAK = 'Ad Break';

Connector.scrobblingDisallowedReason = () => {
	const artist = Connector.getArtistTrack()?.artist;
	if (
		artist === null ||
		artist === LIVE_365_ARTIST ||
		artist === 'undefined'
	) {
		return 'FilteredTag';
	}
	if (artist?.includes(ADWTAG) || artist?.includes(ADBREAK)) {
		return 'IsAd';
	}
	return null;
};

/*

UPDATE: This function no longer exists anywhere in the codebase.

// By overriding this method we can work around the limitation of not being able to do a proper selector for the player
Connector.getObserveTarget = () => {
	// By selecting the parent of the track art, we get something very close to the player, which results in an overall better behaviour
	return document.querySelector(Connector.playerSelector as string)
		?.parentElement;
};
*/
