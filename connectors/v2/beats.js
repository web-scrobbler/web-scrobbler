'use strict';

/* global Connector */

Connector.playerSelector = 'title';

Connector.artistSelector = 'div#app__transport div.transport div.transport__detail div.artist-track-target a p.artist';

Connector.trackSelector = 'div#app__transport div.transport div.transport__detail div.artist-track-target a em.track';

Connector.isPlaying = function() {
	return $('#play_pause_icon').hasClass('icon-bicons_pause');
};

Connector.trackArtImageSelector = '#t-art';

/*var parseTime = function() {
	var result = $('#app__transport > div > div.transport__scrubber > div > div > div.horizontal_bar__empty > div > div').html().split("|");
	if (typeof(result) !== null ) {
		currentTime = Connector.stringToSeconds(result[0]);
		duration = Connector.stringToSeconds(result[1]);
	}else{
		currentTime = 0;
		duration = 0;
	}
	return {currentTime: currentTime, duration: duration};
};

Connector.getDuration = function () {
	return parseTime().duration;
};

Connector.getCurrentTime = function () {
	return parseTime().currentTime;
};*/

this.getUniqueID = function () {
	return $('#app__transport > div > div.transport__detail > div > a').attr('href');
};

/*this.getTrackArt = function () {
	return $("#t-art").css("background-image").substring(4, $("#t-art").css("background-image").length-1);
};*/