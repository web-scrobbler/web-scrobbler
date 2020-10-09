'use strict';

const artistName = 'Bull of Heaven';

const trackPrefixRegex = /\d+ - /;

const playButtonSelector = '.jp-play';

const filter = new MetadataFilter({ track: removeNumericPrefixes });

Connector.applyFilter(filter);

function removeNumericPrefixes(track) {
	return track.replace(trackPrefixRegex, '');
}

Connector.playerSelector = '#jp_container_N';

Connector.getArtist = () => artistName;

Connector.trackSelector = '.jp-playlist-current .playlist-title';

Connector.trackArtSelector = '#jp_poster_0';

Connector.currentTimeSelector = '.jp-current-time';

Connector.durationSelector = '.jp-duration';

Connector.isPlaying = () => !Util.isElementVisible(playButtonSelector);
