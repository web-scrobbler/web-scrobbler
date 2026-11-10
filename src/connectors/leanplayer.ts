export {};

/**
 * connector for players by leanStream
 * @see {@link https://www.leanstream.net}
 *
 * examples:
 * - Indie88 {@link https://indie88.leanplayer.com/CINDFM}
 * - 107.5KOOLFM {@link https://cob.leanplayer.com/CKMBFM}
 * - ...find more leanplayer.com subdomains in a search engine
 */

Connector.playerSelector = '.mediaplayer';

Connector.pauseButtonSelector = '.btn-stop';

// they all have the artist and title flipped...
Connector.trackSelector = '#track-info-artist';
Connector.artistSelector = '#track-info-title';

Connector.trackArtSelector = '#album-art';
Connector.isTrackArtDefault = (trackArtUrl) =>
	!(trackArtUrl?.includes('albumart.leanplayer.com') ?? false);
