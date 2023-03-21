export {};

Connector.playerSelector = '.fm-player';

Connector.artistSelector =
	'.player-display__meta .player-display__meta--artist';

Connector.trackSelector = '.player-display__meta .player-display__meta--title';

Connector.pauseButtonSelector = '.fm-player__btn.playbutton--playing';

function removeEnclosingQuotes(track: string) {
	return track.trim().slice(1, -1);
}

const filter = MetadataFilter.createFilter({ track: removeEnclosingQuotes });

Connector.applyFilter(filter);
