'use strict';

/* global Connector */

Connector.playerSelector = '#opbanner';

//Connector.artistSelector = '#divsonglist ul li.play_current strong.singer_name';
Connector.getArtist = function () {
	console.log('web scrobbler: artist=>'+$('#sim_song_info .js_singer').attr('title'));
	return  $('#sim_song_info .js_singer').attr('title') || null;
};

// Connector.trackSelector = '#divsonglist ul li.play_current strong.music_name';
Connector.getTrack = function() {
	console.log('web scrobbler: song=>'+$('#sim_song_info .js_song').attr('title'));
	return  $('#sim_song_info .js_song').attr('title') || null;
};

Connector.getDuration = function () {
	var totalSecondValue = $('#time_show').text().split('/')[1], duration = '';
	if (totalSecondValue) {
		duration = +totalSecondValue.split(':')[0]*60 + (+totalSecondValue.split(':')[1]);
	}
	console.log('web scrobbler: duration=>'+duration);
	return duration;
};

//Connector.currentTimeSelector = '#time_show';
Connector.getCurrentTime = function() { 
	var totalSecondValue = $('#time_show').text().split('/')[1], 
		curSecondValue = $('#time_show').text().split('/')[0], 
		duration = '', curTime = '';
	if (totalSecondValue) {
		duration = +totalSecondValue.split(':')[0]*60 + (+totalSecondValue.split(':')[1]);
		curTime = +curSecondValue.split(':')[0]*60 + (+curSecondValue.split(':')[1]);
	}
	console.log('web scrobbler: curTime=>'+curTime);
	return curTime;
};

Connector.isPlaying = function () {
	// console.log('web scrobbler: isPlaying=>'+$('#btnplay').hasClass('btn_big_play--pause'));
	return $('#btnplay').hasClass('btn_big_play--pause');
};

// Connector.trackArtImageSelector = '#divsonginfo a.album_pic img';
Connector.getTrackArt = function() {
	// console.log($('#song_pic').attr('src'));
	// return  $('#song_pic').attr('src') || null;
	return null;
}


Connector.getAlbum = function () {
	console.log('web scrobbler: album_pic=>'+$('#song_pic').attr('src'));
	return $('#song_pic').attr('src') || null;
};
//Connector.playButtonSelector = '#divsongframe .bar_op strong:nth-child(2)';
