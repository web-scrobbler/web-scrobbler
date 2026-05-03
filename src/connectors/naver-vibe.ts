export {};

Connector.playerSelector = '#player';

Connector.artistSelector = '#player a[href^="/artist/"]';

Connector.trackSelector = '#player a[href^="/track/"]';

Connector.albumSelector = '#player a[href^="/album/"]';

const currentTimeSelector = '#player .bar_play .time';

Connector.getTimeInfo = () => {
	const currentTime = Util.getSecondsFromSelectors(currentTimeSelector);

	let duration;
	if (currentTime) {
		const barStyle = Util.getAttrFromSelectors(
			'#player .bar_progress .bar_play',
			'style',
		);
		if (barStyle) {
			const width = 'width:';
			const widthIdx = barStyle.indexOf(width);
			const progressPercent = barStyle
				.substring(
					widthIdx + width.length,
					barStyle.indexOf('#', widthIdx + width.length),
				)
				.trim();
			duration = currentTime / (+progressPercent / 100);
			if (isNaN(duration)) {
				duration = undefined;
			}
		}
	}

	return { currentTime, duration };
};

Connector.pauseButtonSelector = '#player #btn_now.play';

Connector.trackArtSelector = '#player .thumb img';
