export {};

/**
 * Connector for the Bandcamp embedded player on poeba.lu.
 */

Connector.playerSelector = '#player';

Connector.trackSelector = '#currenttitle_title';

Connector.artistSelector = '#artist';

Connector.albumSelector = '#album';

Connector.currentTimeSelector = '#currenttime';

Connector.durationSelector = '#totaltime';

Connector.isPlaying = () =>
	Util.hasElementClass(Connector.playerSelector, 'playing');
