'use strict';

Connector.playerSelector = '.navigation';

Connector.artistSelector = '#song_singer';

Connector.trackSelector = '#song_name';

Connector.playButtonSelector = '.play';

Connector.trackArtSelector = '#song_image';

Connector.getTrackArt = () => {
	let trackArtUrl = $(Connector.trackArtSelector).attr('src');

	// Normalize the URL here because the protocol cannot be resolved in the background script what
	// leads to absent picture in popups and notifications.
	if (trackArtUrl.startsWith('//')) {
		trackArtUrl = location.protocol + trackArtUrl;
	}

	return trackArtUrl;
};

Connector.isTrackArtDefault = (trackArtUrl) => {
	let defaultFiles = [
		'business.jpg', 'top_hits.jpg', 'ksrock.png', 'KSlounge.png'
	];

	for (let file of defaultFiles) {
		if (`${location.origin}/img/appimg/${file}` === trackArtUrl) {
			return true;
		}
	}

	return false;
};

Connector.isScrobblingAllowed = () => Connector.getArtist() !== 'Kyivstar';
