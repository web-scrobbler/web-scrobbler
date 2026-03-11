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
		const bar_style = Util.getAttrFromSelectors(
			'#player .bar_progress .bar_play',
			'style',
		);
		if (bar_style) {
			const width = 'width:';
			const width_idx = bar_style.indexOf(width);
			const progress_percent = bar_style
				.substring(
					width_idx + width.length,
					bar_style.indexOf('#', width_idx + width.length),
				)
				.trim();
			duration = currentTime / (+progress_percent / 100);
			if (isNaN(duration)) duration = undefined;
		}
	}

	return { currentTime, duration };
};

Connector.pauseButtonSelector = '#player #btn_now.play';

Connector.trackArtSelector = '#player .thumb img';
