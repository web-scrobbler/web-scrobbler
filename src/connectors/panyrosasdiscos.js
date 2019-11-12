'use strict';

Connector.playerSelector = '#interfaceMI_0';

Connector.pauseButtonSelector = '#statusMI_0 .mjp-playing';

Connector.trackSelector = '#T_mp3j_0';

Connector.getTrackInfo = () => {
	const text = Util.getTextFromSelectors('.entry-title');
	const pattern = /(pyr[0-9]+) (.+) – (.+)/g;
	const matches = [...text.matchAll(pattern)][0];
	return {
		uniqueID: `${matches[1]}#${$('.mp3j_A_current').attr('id')}`,
		artist: matches[2],
		album: matches[3],
	};
};

Connector.trackArtSelector = '.entry-content img:eq(0)';

Connector.currentTimeSelector = '#P-Time-MI_0';

Connector.durationSelector = '#T-Time-MI_0';
