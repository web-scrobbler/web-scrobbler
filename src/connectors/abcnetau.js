'use strict';

Connector.playerSelector = '#main-content';

Connector.artistSelector = '.playingNow div[class*="songArtist"], .view-liveMusicNow .artist';

Connector.trackSelector = '.playingNow h3, .view-liveMusicNow .title';

Connector.albumSelector = '.playingNow div[class*="songRelease"], .view-liveMusicNow .release';

Connector.isPlaying = () => {
	const $playerElement = document.querySelector('#jwplayerDiv, #radio-player4-player');

	if (!$playerElement) {
		return false;
	}

	return $playerElement.classList.contains('jw-state-playing');
};
