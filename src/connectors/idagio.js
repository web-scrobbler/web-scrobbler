'use strict';

const symphonySelector = '.player-PlayerInfo__infoEl--2jhHY span:nth-child(3) span';
const movementSelector = '.player-PlayerInfo__infoEl--2jhHY span span span';
const directorSelector = '.player-PlayerInfo__recordingInfo--15VMv>span:first-child span';
const recordingInfoSelector = '.player-PlayerInfo__recordingInfo--15VMv';
const pauseButtonSelector = '.player-PlayerControls__btn--1r-vy:nth-child(2) .util-IconLabel__component--3Uitr span';

Connector.playerSelector = '.player-PlayerBar__bar--2yos_';

Connector.artistSelector = '.player-PlayerInfo__infoEl--2jhHY span:first-child';

Connector.getTrack = () => getCurrentTrack();

Connector.getAlbum = () => getCurrentSymphony();

Connector.currentTimeSelector = '.player-PlayerProgress__progress--2F0qB>span';

Connector.durationSelector = '.player-PlayerProgress__timeTotal--3aHlj span';

Connector.isPlaying = () => document.querySelector(recordingInfoSelector).innerHTML !== 'Sponsor message' && document.querySelector(pauseButtonSelector).innerHTML === 'Pause';

function getCurrentTrack() {
	if (document.querySelector(symphonySelector)) {
		return `${document.querySelector(symphonySelector).innerText}: ${document.querySelector(movementSelector).innerText}`;
	}
}

function getCurrentSymphony() {
	if (document.querySelector(symphonySelector)) {
		return `${document.querySelector(symphonySelector).innerText.split(/ in [A-G]/)[0]} (${document.querySelector(directorSelector).innerText})`;
	}
}
