'use strict';

const filter = new MetadataFilter({ artist: removeTrailingDash });

Connector.playerSelector = '#indieshuffle_player';

Connector.artistSelector = '#player-current .artist';

Connector.trackSelector = '#player-current .title';

Connector.trackArtSelector = '#player-current > div > a.ajaxlink.pink > img';

Connector.currentTimeSelector = '#player-current > .progress > .seek';

Connector.durationSelector = '#player-current > .progress > .duration';

Connector.isPlaying = () => Util.hasElementClass('#playerPlaying', 'active');

Connector.applyFilter(filter);

function removeTrailingDash(text) {
	return text.replace(/\s-\s$/, '');
}
