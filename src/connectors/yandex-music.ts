export {};

// this accommodates both desktop and mobile player.
// during fullscreen the bar still exists underneath
const playerSelector =
	'section[class*="PlayerBar_root__"]:has([class*="Meta_titleContainer__"])';
Connector.playerSelector = playerSelector;

Connector.getTrack = () => {
	const titleContainer = `${playerSelector} [class*="Meta_titleContainer__"]`;
	let title = Util.getTextFromSelectors(
		`${titleContainer} [class*="Meta_title__"]`,
	)?.trim();
	const version = Util.getTextFromSelectors(
		`${titleContainer} [class*="Meta_version__"]`,
	)?.trim();

	if (version) {
		title += ` (${version})`;
	}

	return title;
};

Connector.artistSelector = `${playerSelector} [class*="Meta_artists__"]`;

Connector.getTrackArt = () => {
	const url = Util.extractImageUrlFromSelectors('img[class*="_cover__"]');

	return url?.replace(/\d+x\d+$/g, '800x800');
};

Connector.getCurrentTime = () => {
	const timeStr = Util.getAttrFromSelectors(
		`${playerSelector} input[class*=_slider__]`,
		'value',
	);
	return timeStr ? parseFloat(timeStr) : null;
};

Connector.getDuration = () => {
	const durStr = Util.getAttrFromSelectors(
		`${playerSelector} input[class*=_slider__]`,
		'max',
	);
	return durStr ? parseFloat(durStr) : null;
};

Connector.isPlaying = () => {
	const playPauseButtonSelectors = [
		`${playerSelector} button[class*="BaseSonataControlsDesktop_sonataButton__"] svg[class*="BaseSonataControlsDesktop_playButtonIcon__"] use`,
		`${playerSelector} [class*=PlayerBarMobile_infoButtons__] button:last-child svg use`,
	];

	// xlink:href is deprecated, they will probably change it out at some point
	const useHrefAttr =
		Util.getAttrFromSelectors(playPauseButtonSelectors, 'xlink:href') ??
		Util.getAttrFromSelectors(playPauseButtonSelectors, 'href');

	return useHrefAttr?.includes('pause') ?? false;
};

Connector.isLoved = () => {
	const playPauseButtonSelectors = [
		`${playerSelector} [class*="PlayerBarDesktopWithBackgroundProgressBar_sonata__"] button:first-child svg use`,
		`${playerSelector} [class*=PlayerBarMobile_infoButtons__] button:first-child svg use`,
	];

	const useHrefAttr =
		Util.getAttrFromSelectors(playPauseButtonSelectors, 'xlink:href') ??
		Util.getAttrFromSelectors(playPauseButtonSelectors, 'href');

	return useHrefAttr?.includes('liked');
};
