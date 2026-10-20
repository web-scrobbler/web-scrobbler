export {};

Connector.useMediaSessionApi();

Connector.playerSelector = '#root';

Connector.pauseButtonSelector = '#btn_pc_minibar_play.play-pause-btn';

const timeRegEx = /^\d{1,2}:\d{2}(?::\d{2})?$/;

Connector.getTimeInfo = () => {
	const spaceContainer = document.querySelector<HTMLElement>(
		'[class^="SpaceContainer_"]',
	);
	if (!spaceContainer) {
		return null;
	}

	const times = spaceContainer.innerText
		.split('\n')
		.map((text) => text.trim())
		.filter((text) => timeRegEx.test(text));

	if (times.length < 2) {
		return null;
	}

	return {
		currentTime: Util.stringToSeconds(times[0]),
		duration: Util.stringToSeconds(times[1]),
	};
};
