export {};

Connector.useMediaSessionApi();

Connector.playerSelector = '#root';

Connector.pauseButtonSelector = '#btn_pc_minibar_play.play-pause-btn';

function isNumeric(value: string): boolean {
	return (
		value.length > 0 &&
		Array.from(value).every((char) => char >= '0' && char <= '9')
	);
}

function parseTime(text: string): number | null {
	const parts = text.split(':');

	if (parts.length < 2 || parts.length > 3) {
		return null;
	}

	if (!isNumeric(parts[0]) || parts[0].length > 2) {
		return null;
	}

	if (!parts.slice(1).every((part) => part.length === 2 && isNumeric(part))) {
		return null;
	}

	return Util.stringToSeconds(text);
}

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
		.map(parseTime)
		.filter((time): time is number => time !== null);

	if (times.length < 2) {
		return null;
	}

	return {
		currentTime: times[0],
		duration: times[1],
	};
};
