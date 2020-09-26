'use strict';

const symphonySelector = '.player-PlayerInfo__infoEl--2jhHY span:nth-child(3) span';
const movementSelector = '.player-PlayerInfo__infoEl--2jhHY span span span';
const directorSelector = '.player-PlayerInfo__recordingInfo--15VMv>span:first-child span';
const recordingInfoSelector = '.player-PlayerInfo__recordingInfo--15VMv';
const pauseButtonSelector = '.player-PlayerControls__btn--1r-vy:nth-child(2) .util-IconLabel__component--3Uitr span';

Connector.playerSelector = '.player-PlayerBar__bar--2yos_';

Connector.artistSelector = '.player-PlayerInfo__infoEl--2jhHY span:first-child';

Connector.getTrack = getCurrentTrack;

Connector.getAlbum = getCurrentSymphony;

Connector.currentTimeSelector = '.player-PlayerProgress__progress--2F0qB>span';

Connector.durationSelector = '.player-PlayerProgress__timeTotal--3aHlj span';

Connector.isPlaying = () => Util.getTextFromSelectors(pauseButtonSelector) === 'Pause';

Connector.isScrobblingAllowed = () => Util.getTextFromSelectors(recordingInfoSelector) !== 'Sponsor message';

function getCurrentTrack() {
	const symphony = Util.getTextFromSelectors(symphonySelector);
	const movement = Util.getTextFromSelectors(movementSelector);
	return `${symphony}: ${movement}`;
}

function getCurrentSymphony() {
	const symphonyShort = Util.getTextFromSelectors(symphonySelector).split(/ in [A-G]/)[0];
	const director = Util.getTextFromSelectors(directorSelector);
	return `${symphonyShort} (${director})`;
}
