/**
 * Connector for Radio Swiss Classic web player.
 * @author Gemini Code Assist
 */

'use strict';

Connector.playerSelector = '#rsc-player';

Connector.artistSelector = '.rsc-player-main-text-composer';

Connector.trackSelector = '.rsc-player-main-text-title';

Connector.albumSelector = '.rsc-player-main-text-album';

Connector.trackArtSelector = '.rsc-player-main-cover-image img';

Connector.isPlaying = () => {
	// The pause icon is only visible when the player is playing.
	return Util.isElementVisible('.rsc-player-main-controls-play-pause');
};
