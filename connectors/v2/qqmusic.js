'use strict';

/* global Connector */

Connector.playerSelector = '#opbanner';

//Connector.artistSelector = '#divsonglist ul li.play_current strong.singer_name';
Connector.getArtist = function () {
	console.log('web scrobbler: artist=>'+$('#sim_song_info .js_singer').attr('title'));
	return  $('#sim_song_info .js_singer').attr('title');
};

// Connector.trackSelector = '#divsonglist ul li.play_current strong.music_name';
Connector.getTrack = function() {
	console.log('web scrobbler: song=>'+$('#sim_song_info .js_song').attr('title'));
	return  $('#sim_song_info .js_song').attr('title');
};

Connector.getDuration = function () {
	var totalSecondValue = $('#time_show').text().split('/')[1], duration = '';
	duration = Connector.stringToSeconds(totalSecondValue);
	console.log('web scrobbler: duration=>'+duration);
	return duration;
};

//Connector.currentTimeSelector = '#time_show';
Connector.getCurrentTime = function() { 
	var curSecondValue = $('#time_show').text().split('/')[0], 
		curTime = '';
	curTime = Connector.stringToSeconds(curSecondValue);
	console.log('web scrobbler: curTime=>'+curTime);
	return curTime;
};

Connector.isPlaying = function () {
	// console.log('web scrobbler: isPlaying=>'+$('#btnplay').hasClass('btn_big_play--pause'));
	return $('#btnplay').hasClass('btn_big_play--pause');
};


Connector.getAlbum = function () {
	console.log('web scrobbler: album_pic=>'+$('#album_name a').attr('title'));
	return $('#album_name a').attr('title');
};

Connector.trackArtImageSelector = '#song_pic';