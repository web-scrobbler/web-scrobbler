'use strict';

Connector.playerSelector = '.player-PlayerBar__bar--2yos_';

Connector.artistSelector = '.player-PlayerInfo__infoEl--2jhHY span:first-child';

Connector.getTrack = getCurrentTrack;

Connector.getAlbum = getCurrentSymphony;

Connector.currentTimeSelector = '.player-PlayerProgress__progress--2F0qB>span';

Connector.durationSelector = '.player-PlayerProgress__timeTotal--3aHlj span';

Connector.isPlaying = () => Util.getTextFromSelectors('.player-PlayerControls__btn--1r-vy:nth-child(2) .util-IconLabel__component--3Uitr span') === 'Pause';

Connector.isScrobblingAllowed = () => Util.getTextFromSelectors('.player-PlayerInfo__recordingInfo--15VMv') !== 'Sponsor message';

function getCurrentTrack() {
	return Util.getTextFromSelectors('.player-PlayerInfo__infoEl--2jhHY').split(' – ').slice(1).join(': ');
}

function getCurrentSymphony() {
	const symphonyShort = Util.getTextFromSelectors('.player-PlayerInfo__infoEl--2jhHY span:nth-child(3) span:first-child').split(/ in [A-G]/)[0].split(/ op. [0-9]/)[0].split(/ KV [0-9]/)[0];
	const commonName = Util.getTextFromSelectors('.player-PlayerInfo__infoEl--2jhHY span:nth-child(3) span:nth-child(2)') || '';
	const director = removeParenthesis(Util.getTextFromSelectors('.player-PlayerInfo__recordingInfo--15VMv>span:first-child span'));
	return `${symphonyShort}${commonName} (${director})`;
}

function removeParenthesis(text) {
	return text.replace(/\s*\(.*?\)\s*/g, '');
}
