'use strict';

Connector.playerSelector = '#interfaceMI_0';

Connector.pauseButtonSelector = '#statusMI_0 .mjp-playing';

const splitAlbumData = () => {
	const text = Util.getTextFromSelectors('.entry-title');
	const pattern = /(pyr[0-9]+) (.+) – (.+)/g;
	const matches = [...text.matchAll(pattern)][0];
	return {
		catalog: matches[1],
		artist: matches[2],
		album: matches[3],
	};
};

Connector.getArtist = () => splitAlbumData().artist;

Connector.getAlbum = () => splitAlbumData().album;

Connector.trackSelector = '#T_mp3j_0';

Connector.getUniqueID = () => `${splitAlbumData().catalog}#${$('.mp3j_A_current').attr('id')}`;

Connector.trackArtSelector = '.entry-content > p > a > img';

Connector.currentTimeSelector = '#P-Time-MI_0';

Connector.durationSelector = '#T-Time-MI_0';
