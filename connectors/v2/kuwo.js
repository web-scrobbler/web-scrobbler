'use strict';

/* global Connector */

Connector.playerSelector = '#player';

//Connector.artistSelector = '#divsonglist ul li.play_current strong.singer_name';
Connector.getArtist = function () {
	console.log('web scrobbler: artist=>'+$('#wp_text').attr('title').split('-')[1]);
	return  $('#wp_text').attr('title').split('-')[1] || null;
};

// Connector.trackSelector = '#divsonglist ul li.play_current strong.music_name';
Connector.getTrack = function() {
	console.log('web scrobbler: song=>'+$('#wp_text').attr('title').split('-')[0]);
	return  $('#wp_text').attr('title').split('-')[0] || null;
};

Connector.getDuration = function () {
	var curTime = $("#wp_playTime").text(), curSecond, curProcess, total, duration=200;
	if (curTime != '00:00') {
		curSecond = +curTime.split(':')[0]*60 + (+curTime.split(':')[1]);
		curProcess = +$("#wp_processBar").attr("style").replace('width: ','').replace('px;','');
		total = +$("#wp_bufBar").attr("style").replace('width: ','').replace('px;','');
		if(curProcess>0)duration = Math.ceil(curSecond*total / curProcess);
	}
	console.log('web scrobbler: duration=>'+duration);
	return duration;
};

//Connector.currentTimeSelector = '#time_show';
Connector.getCurrentTime = function() { 
	var curTime = $("#wp_playTime").text(), curSecond;
	if (curTime) {
		curSecond = +curTime.split(':')[0]*60 + (+curTime.split(':')[1]);
	}
	console.log('web scrobbler: curSecond=>'+curSecond);
	return curSecond;
};

Connector.isPlaying = function () {
	// console.log('web scrobbler: isPlaying=>'+$('#wp_playBtn').hasClass('zan'));
	return $('#wp_playBtn').hasClass('zan');
};

// Connector.trackArtImageSelector = '#divsonginfo a.album_pic img';
Connector.getTrackArt = function() {
	// console.log($('#artist_Image').attr('src'));
	return  $('#artist_Image').attr('src') || null;
}

Connector.getAlbum = function () {
	return null;
};
//Connector.playButtonSelector = '#divsongframe .bar_op strong:nth-child(2)';
