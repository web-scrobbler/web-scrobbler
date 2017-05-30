'use strict';

/* global Connector, MetadataFilter, Util */

/**
 * The connector for new version of Spotify (open.spotify.com).
 */
 
var albumTitle;

Connector.playerSelector = '.now-playing-bar';

Connector.getArtist = function () {
	let artists = $('.track-info__artists a').toArray();
	return Util.joinArtists(artists);
};

Connector.getAlbum = function () {
	if($('.now-playing a')[0].href.indexOf('artist') >= 0 || $('.now-playing a')[0].href.indexOf('playlist') >= 0){
		$.ajax({ url: $('.now-playing .react-contextmenu-wrapper a')[0].href, success: function(data) { parseAlbumTitle(data); }});
	}
	else if($('.now-playing a')[0].href.indexOf('album') >= 0){
		$.ajax({ url: $('.now-playing a')[0].href, success: function(data) { parseAlbumTitle(data); }});	
	}
	return albumTitle;
}

function parseAlbumTitle(data){
	albumTitle = ($.parseHTML(data)[3].content);
}

Connector.trackSelector = '.track-info__name a';

Connector.trackArtImageSelector = '.now-playing__cover-art .cover-art-image-loaded';

Connector.playButtonSelector = '.control-button[class*="spoticon-play-"]';

Connector.currentTimeSelector = '.playback-bar__progress-time:first-child';

Connector.durationSelector = '.playback-bar__progress-time:last-child';

Connector.filter = MetadataFilter.getRemasteredFilter();