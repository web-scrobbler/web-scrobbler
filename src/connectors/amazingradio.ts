export {};

const filter = MetadataFilter.createFilter({ track: removeEdit });

Connector.playerSelector = '#player';

Connector.artistSelector = [
	'#player .playerInfo h3.name > a',
	'#player .playerInfo .tune a.name',
];

Connector.trackSelector = [
	'#player .playerInfo h5.title > a',
	'#player .playerInfo .tune a.title',
];

Connector.trackArtSelector = '#player img.artwork';

Connector.isTrackArtDefault = (url) => url?.includes('/defaults/');

Connector.isPlaying = () => {
	const playerControlsIcon = Util.getAttrFromSelectors(
		'#player .control-btns .playerControls',
		'data-mat-icon-name'
	);
	return playerControlsIcon === 'levels' || playerControlsIcon === 'pause';
};

Connector.applyFilter(filter);

function removeEdit(text: string) {
	return text.replace(/\s?\((Clean|Radio) Edit\)/i, '');
}
