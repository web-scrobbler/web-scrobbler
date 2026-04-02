export {};

const filter = MetadataFilter.createFilter({ artist: removeDashes });
const audioPlayer = '[aria-label="Audio player"]';
const buttonFullscreen = 'button[aria-label="Open full-screen player"]';

Connector.playerSelector = '#root'; // player not in DOM until initiated by user

Connector.playButtonSelector = `${audioPlayer} button[aria-label=Play]`;

Connector.isPodcast = () =>
	Util.isElementVisible(`${audioPlayer} button[aria-label$="15 seconds"]`);

Connector.trackSelector = `${audioPlayer} ${buttonFullscreen} span:first-of-type`;

Connector.artistSelector = `${audioPlayer} ${buttonFullscreen} span:nth-of-type(2)`;

Connector.getArtist = () =>
	Util.getTextFromSelectors(Connector.artistSelector)?.split(' • ')[0];

Connector.trackArtSelector = `${audioPlayer} ${buttonFullscreen} img`;

Connector.isTrackArtDefault = (url) =>
	url?.includes('radioimg.audacy.com') || url?.startsWith('data:image');

Connector.scrobblingDisallowedReason = () => {
	const artist = Connector.getArtist();
	const track = Connector.getTrack();

	if (
		artist === track ||
		artist?.includes('Audacy') ||
		(Util.getTextFromSelectors(Connector.artistSelector) === artist &&
			!Connector.isPodcast())
	) {
		if (track?.startsWith('Advertisement')) {
			return 'IsAd';
		}
		return 'FilteredTag';
	}

	return null;
};

Connector.applyFilter(filter);

function removeDashes(text: string) {
	return text.replace(/-/g, ' ');
}
