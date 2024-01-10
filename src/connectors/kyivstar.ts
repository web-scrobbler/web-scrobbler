export {};

Connector.playerSelector = '.navigation';

Connector.artistSelector = '#song_singer';

Connector.trackSelector = '#song_name';

Connector.playButtonSelector = '.play';

Connector.trackArtSelector = '#song_image';

Connector.isTrackArtDefault = (trackArtUrl) => {
	const defaultFiles = [
		'business.jpg',
		'top_hits.jpg',
		'ksrock.png',
		'KSlounge.png',
	];

	for (const file of defaultFiles) {
		if (`${location.origin}/img/appimg/${file}` === trackArtUrl) {
			return true;
		}
	}

	return false;
};

Connector.scrobblingDisallowedReason = () =>
	Connector.getArtist() === 'Kyivstar' ? 'FilteredTag' : null;
