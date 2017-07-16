'use strict';

const INFO_CURRENT_TIME = 1;
const INFO_ARTIST = 2;
const INFO_TITLE = 3;
const INFO_DURATION = 4;

Connector.playerSelector = '#player';

Connector.getArtist = () => getSongInfo(INFO_ARTIST);

Connector.getTrack = () => getSongInfo(INFO_TITLE);

Connector.getDuration = () => {
	let durationStr = getSongInfo(INFO_DURATION);
	return Util.stringToSeconds(durationStr);
};

Connector.getCurrentTime = () => {
	let currentTimeStr = getSongInfo(INFO_CURRENT_TIME);
	return Util.stringToSeconds(currentTimeStr);
};

Connector.isPlaying = () => {
	let duration = Connector.getDuration();
	// Zero duration means song is unable to be played.
	return duration && $('#play').hasClass('pause');
};

Connector.getUniqueID = () => $('#player').attr('file_id');

/* Extract the information field from the whole string,
 * e.g. '00:01 deadmau5 & Kaskade — I Remember (03:51)'.
 */
function getSongInfo(field) {
	let pattern = /(.+?)\s(.+)\s—\s(.+)\s\(([^)]+)\)/gi;
	return pattern.exec($('.now-playing').text())[field];
}
