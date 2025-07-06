/**
 * Connector for Online Radio Box player.
 * @author Gemini Code Assist
 */

'use strict';

Connector.playerSelector = '.player-wrap';

Connector.artistTrackSelector = '#np_title';

Connector.getArtist = () => {
	const artist = Util.getArtist();
	if (artist === 'Radio Swiss Classic') {
		return null;
	}
	return artist;
};

Connector.trackArtSelector = '#np_cover';

Connector.isPlaying = () => Util.isElementVisible('#b_play .fa-pause');
