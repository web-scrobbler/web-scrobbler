export {};

// radioplyr, named after the `plyr` shorthand in the tags
// used on two turkish radio websites

Connector.playerSelector = '.cstRadyoPlayer';

Connector.artistTrackSelector = '#NowPlaying';

Connector.isPlaying = () =>
	Util.isElementVisible('.plyr__controls button[data-plyr="pause"]');

const radioName = Util.getTextFromSelectors('.copyright')?.match(
	/Copyright ©\s*(.+?)\s*\d{4,}/,
)?.[1];
if (radioName) {
	// alias "Radyo Voyage"
	// alias "Radyo Eksen"
	Connector.meta.label = radioName;
}
