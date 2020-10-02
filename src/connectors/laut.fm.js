'use strict';

Connector.playerSelector = '.fm-player';

Connector.artistSelector = '.player-display__meta .player-display__meta--artist';

Connector.trackSelector = '.player-display__meta .player-display__meta--title';

Connector.isPlaying = () => $('.fm-player__btn').hasClass('playbutton--playing');

function removeEnclosingQuotes(track) {
	return track.trim().slice(1, -1);
}

const filter = new MetadataFilter({ track: removeEnclosingQuotes });

Connector.applyFilter(filter);
