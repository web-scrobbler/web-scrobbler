export {};

const playerBar = '#music';

function getCatalogID() {
	return Util.getTextFromSelectors(`${playerBar} .u-album`);
}

Connector.useMediaSessionApi();

Connector.playerSelector = '.u-control.u-process';

Connector.artistSelector = `${playerBar} .u-artist`;

Connector.trackSelector = `${playerBar} .u-music-title`;

Connector.getAlbum = () => {
	const catalogID = getCatalogID();
	const albumHeader = Util.queryElements(
		`.eps._playAlbum[data-catalogueid="${catalogID}"]`
	);
	if (albumHeader && albumHeader.length > 0) {
		return albumHeader[0].textContent;
	}
	return null;
};

Connector.currentTimeSelector = `${playerBar} .u-control.u-surplusTime`;

Connector.durationSelector = `${playerBar} .u-control .u-time`;

Connector.playButtonSelector = `${playerBar} .u-play-btn.ctrl-play.paused`;

Connector.trackArtSelector = `${playerBar} .u-cover img`;

Connector.getUniqueID = () => {
	const catalogID = getCatalogID();
	// Remark: NML starts counting track numbers from 0
	const trackNum = Util.getAttrFromSelectors(
		`${playerBar} span.u-album`,
		'data-tracknum'
	);
	return `${catalogID}+${trackNum}`;
};
