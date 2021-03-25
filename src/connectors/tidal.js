'use strict';

Connector.playerSelector = '#footerPlayer';

Connector.playButtonSelector = `${Connector.playerSelector} [data-type="button__pause"]`;

Connector.pauseButtonSelector = `${Connector.playerSelector} [data-type="button__play"]`;

Connector.isScrobblingAllowed = () => !!$(Connector.playButtonSelector);

Connector.trackSelector = `${Connector.playerSelector} [data-test="footer-track-title"]`;

Connector.getUniqueID = () => {
	const trackUrl = $(Connector.trackSelector).attr('href');
	if (trackUrl) {
		return trackUrl.split('/').pop();
	}
	return null;
};

Connector.artistSelector = `${Connector.playerSelector} .artist-link`;

Connector.albumSelector = ['#nowPlaying [class^="infoTable--"] a[href^="/album/"]', `${Connector.playerSelector} a[href^="/album"]`];

Connector.trackArtSelector = `${Connector.playerSelector} [data-test="current-media-imagery"] img`;

Connector.currentTimeSelector = `${Connector.playerSelector} [data-test="current-time"]`;

Connector.durationSelector = `${Connector.playerSelector} [data-test="duration-time"]`;

Connector.applyFilter(MetadataFilter.getTidalFilter());
