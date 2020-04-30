'use strict';

Connector.playerSelector = '#interfaceMI_0';

Connector.pauseButtonSelector = '#statusMI_0 .mjp-playing';

Connector.trackSelector = '#T_mp3j_0';

Connector.getTrackInfo = () => {
	const text = Util.getTextFromSelectors('.entry-title');
	const pattern = /(pyr\d+) (.+) – (.+)/g;
	const matches = [...text.matchAll(pattern)][0];
	const mp3Id = Util.getAttrFromSelectors('.mp3j_A_current', 'id');

	return {
		uniqueID: `${matches[1]}#${mp3Id}`,
		artist: matches[2],
		album: matches[3],
	};
};

Connector.trackArtSelector = '.entry-content img';

Connector.currentTimeSelector = '#P-Time-MI_0';

Connector.durationSelector = '#T-Time-MI_0';
