export {};

Connector.playerSelector = '[class^=_Player_]';

Connector.artistSelector = '[class*=_PlayerMetaName_]';

Connector.albumSelector = '[class^=_PlayerWaveformAlbumData_] a';

Connector.playButtonSelector = '[aria-label="Play"]';

Connector.currentTimeSelector =
	'[class^=_PlayerInteractiveSect_] span:first-child';

Connector.durationSelector = '[class^=_PlayerInteractiveSect_] span:last-child';

Connector.getTrack = () => {
	const track = Util.getTextFromSelectors('[class*=_PlayerMetaSong_]');
	const featArtist = Util.getTextFromSelectors('[class*=_PlayerMetaFeat_] b');

	if (featArtist) {
		return `${track} (${featArtist})`;
	}

	return track;
};

Connector.getTrackArt = () => {
	const trackArt = Util.extractImageUrlFromSelectors(
		'[class^=_PlayerMetaImage_] img',
	);
	if (trackArt && trackArt.includes('?')) {
		const endIdx = trackArt.indexOf('?');
		return trackArt.substring(0, endIdx);
	}

	return trackArt;
};
