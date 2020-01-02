'use strict';

const playerBar = '.player_ct.mini';
const durationSelector = `${playerBar} .time_all`;
const currentTimeSelector = `${playerBar} .time_current`;

Connector.playerSelector = `#app ${playerBar}`;

Connector.artistSelector = `${playerBar} .track_info .artist`;

Connector.trackSelector = `${playerBar} .track_info .title`;

Connector.pauseButtonSelector = '.control_area .icon-player.btn-player-pause';

Connector.trackArtSelector = `${playerBar} .playbar_ct .thumb`;

Connector.getCurrentTime = () => getSeconds(currentTimeSelector);

Connector.getDuration = () => getSeconds(durationSelector);

function getSeconds(selector) {
	const timeStr = $(selector)[0].innerText;
	return Util.stringToSeconds(timeStr);
}
