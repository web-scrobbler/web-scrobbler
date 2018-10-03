'use strict';

let nextCue;
let cue;
let mixDuration = Util.stringToSeconds($('.mediaTabItem:first span').text().split('[')[1].trim().slice(0, -1));

Connector.playerSelector = '.playerWidgetFields';

Connector.trackArtSelector = '#artworkLeft';

Connector.albumSelector = '#pageTitle';

Connector.getUniqueID = () => $('.cPlay').attr('id');

Connector.getArtistTrack = () => {
	let text = $('.cPlay:first meta[itemprop="name"]').attr('content');
	return Util.splitArtistTrack(text);
};

Connector.getCurrentTime = () => {
	let currentTime = Util.stringToSeconds($('#playerWidgetCurrentTime').text());
	return currentTime - cue;
};

Connector.getDuration = () => {
	switch (true) {
		case cue && nextCue > 0: // Typical
			return nextCue - cue;
		case nextCue > 0: // Assume first track
			return nextCue;
		case cue > 0: // Assume last track
			return mixDuration - cue;
	}
};

Connector.isPlaying = () => {
	return $('#playerWidgetPause').hasClass('fa-pause');
};

Connector.isScrobblingAllowed = () => {
	// Didn't find better place to select at. Resolve current and next track cue. Convert it to seconds and save to global connector variables for reuse.
	nextCue = Util.stringToSeconds($('.cPlay:first').nextAll('.topBorder').find('.cueValueField:contains(":")').eq(0).text());
	cue = Util.stringToSeconds($('.cPlay:first').find('.cueValueField').text());
	let suddenSelector = $('.cPlay:first').find('.trackFormat .redTxt').length; // We need to check this at every track change

	return suddenSelector <= 0 && (cue > 0 || nextCue > 0); // Don't scrobble if track have unrecognized parts and don't have enough cues
};
