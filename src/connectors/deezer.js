'use strict';

if($('.page-player').length){
	Connector.playerSelector = '.page-player';
} else {
	Connector.playerSelector = '#page_sidebar';
}

Connector.getArtist = () => {
	if($('.track-title .track-link:eq(1)').length){
		return $('.track-title .track-link:eq(1)').text();		
	} else{
		let artists = $('.player-track-artist').children().toArray();
		return Util.joinArtists(artists);
	}	
};

if($('.track-title .track-link:eq(0)').length){
	Connector.trackSelector = '.track-title .track-link:eq(0)';	
} else {
	Connector.trackSelector = '.player-track-title';
}

if($('.slider-counter-current').length){
	Connector.currentTimeSelector = '.slider-counter-current';	
} else {
	Connector.currentTimeSelector = '.player-progress .progress-time';
}

if($('.slider-counter-max').length){
	Connector.durationSelector = '.slider-counter-max';	
} else {
	Connector.durationSelector = '.player-progress .progress-length';
}

if($('.picture-img.active').length){
	Connector.trackArtSelector = '.picture-img.active';	
} else {
	Connector.trackArtSelector = '.player-cover img';
}

Connector.filter = MetadataFilter.getRemasteredFilter().extend(MetadataFilter.getDoubleTitleFilter());

Connector.isPlaying = () => $('#player .svg-icon-pause').length > 0 || $('.page-player .svg-icon-pause').length > 0;
