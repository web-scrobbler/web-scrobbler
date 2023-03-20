'use strict';

const filter = MetadataFilter.createFilter({ track: removePrefix });

Connector.isPlaying = () => Util.hasElementClass('div#playbtn', 'jp-stopx');
Connector.playerSelector = '.player-content';
Connector.trackSelector = 'h1#song';
Connector.artistSelector = 'h2#artist';
Connector.trackArtSelector = 'img.songimg';

Connector.applyFilter(filter);

function removePrefix(track) {
	return track.replace('Hot-', '').replace('new-', '');
}
