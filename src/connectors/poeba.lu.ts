export {};

/**
 * Connector for the Bandcamp embedded player on poeba.lu.
 *
 * The embedded player runs inside an iframe at bandcamp.com/EmbeddedPlayer/...
 * State: the root #player element gets the class "playing" when audio is playing.
 */

Connector.playerSelector = '#player';

Connector.trackSelector = '#currenttitle_title';

Connector.artistSelector = '#artist';

Connector.albumSelector = '#album';

Connector.currentTimeSelector = '#currenttime';

Connector.durationSelector = '#totaltime';

Connector.isPlaying = () =>
	Util.hasElementClass(Connector.playerSelector, 'playing');
