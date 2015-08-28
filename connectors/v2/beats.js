'use strict';

/* global Connector */

//This is used so that we only do 1 API call per song from Beats
var cachedData = null;

Connector.playerSelector = 'div#app__transport div.transport div.transport__detail';

Connector.artistSelector = 'div#app__transport div.transport div.transport__detail div.artist-track-target a p.artist';

Connector.trackSelector = 'div#app__transport div.transport div.transport__detail div.artist-track-target a em.track';

//This is one place where we get a notion of the play status
Connector.isPlaying = function() {
	return $('#play_pause_icon').hasClass('icon-bicons_pause');
};

//This may not work a lot of the time because it is applied via CSS
Connector.trackArtImageSelector = '#t-art';

//This queries the beats api to get track info
var getMyAlbumData = function () {
	var songID = $('#app__transport > div > div.transport__detail > div > a').attr('href').split('/');

	if (songID[4].length === 0) {
		console.log('Got a error finding album');
		return null;
	}

	var albumApiUrl = 'https://partner.api.beatsmusic.com/v1/api/tracks/' + songID[4] + '?client_id=j9uq3zvzz7sa4vxec9p6nva9';

	var albumName = '';
	$.ajax({
		type:'GET',
		async: false,
		url: albumApiUrl,
		success: function(msg) {
			albumName = msg;
		},
		error: function()
		{
			console.log('Got a error attempting to get album data');
			return null;
		}
	});
	return albumName;
};

Connector.getAlbum = function () {
	if (cachedData === null)
	{
		cachedData = getMyAlbumData();
	}
	var albumValue = '';
	if (cachedData !== null)
	{
		albumValue = cachedData.data.refs.album.display;
	}

	return albumValue;
};

Connector.getDuration = function () {
	if (cachedData === null)
	{
		cachedData = getMyAlbumData();
	}
	var duration = 0;
	if (cachedData !== null)
	{
		duration = cachedData.data.duration;
	}

	return duration || 0;
};

Connector.getUniqueID = function () {
	return $('#app__transport > div > div.transport__detail > div > a').attr('href');
};
