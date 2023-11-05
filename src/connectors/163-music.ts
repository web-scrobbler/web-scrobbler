export {};

const trackRegEx = new RegExp(String.fromCharCode(160), 'g');

Connector.playerSelector = '.m-playbar';

Connector.getTrackArt = () => {
	const src = Util.getAttrFromSelectors('.head.j-flag img', 'src');
	return src?.split('?')[0];
};

Connector.getTrack = () => {
	const track = Util.getTextFromSelectors('.fc1');
	return track?.replace(trackRegEx, ' ');
};

Connector.getArtist = () => Util.getAttrFromSelectors('.by span', 'title');

Connector.playButtonSelector = 'a[data-action="play"]';

Connector.timeInfoSelector = '.time';

Connector.getUniqueID = () => {
	const attr = Util.getAttrFromSelectors('.fc1', 'href');
	return attr?.split('id=').at(-1);
};
