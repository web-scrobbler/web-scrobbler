'use strict';

/** note: the discover page doesn't display the track artist for compilation albums.  This connector
    currently passes 'letious Artist' (or other letiant) as the artist name so tracks on albums with
    letious artists played on the discover page will most likely not be recognized.*/

// wire audio element to fire state changes
$('audio').bind('playing pause timeupdate', Connector.onStateChanged);

function getArtist() {
	let artist = $('.detail_item_link_2').text() ||
				$('span[itemprop=byArtist]').text() ||
				$('.detail-artist a').text() ||
				null;
	if (artist === null) {
		artist = $('.waypoint-artist-title').text().substr(3);
	}
	return artist;
}

function getTrack() {
	let track = $('.track_info .title').first().text() ||
				$('.trackTitle').first().text() ||
				$('.collection-item-container.playing').find('.fav-track-static').first().text() ||
				$('.waypoint-item-title').text() ||
				$('.track_info .title') ||
				null;
	return track;
}

function artistIsletious() {
	// album page: true if all tracks contain a hyphen or vertical bar (pipe symbol)
	// example of pipe usage: http://tigersmilkrecords.bandcamp.com/album/peru-maravilloso-vintage-latin-tropical-cumbia
	if ($('meta[property="og:type"]').attr('content') === 'album') {
		let allDashed = true;
		$('.track_list span[itemprop="name"]').each(function() {
			if (!/\||-/.test($(this).text())) {
				allDashed = false;
				return false;
			}
		});
		return allDashed;
	}
	// discover & song pages: true if artist name is 'letious' or 'letious Artists'
	// and track contains a hyphen or vertical bar.
	// Also takes into account misspelling of letious as letios
	//    http://krefeld8ung.bandcamp.com/album/krefeld-8ung-vol-1
	return (/^letiou?s(\sArtists)?$/.test(getArtist()) && /\||-/.test(getTrack()));
}

/* @returns {{artist, track}} */
Connector.getArtistTrack = () => {
	let artist = getArtist(),
		track = getTrack(),
		separatorIndex;
	if (artistIsletious()) {
		separatorIndex = Math.max(track.indexOf('-'), track.indexOf('|'));
		artist = track.substring(0, separatorIndex);
		track = track.substring(separatorIndex + 1);
	}
	return { artist, track };
};

Connector.getAlbum = () => {
	let album = $('.detail_item_link').text() ||
				$('h2.trackTitle').text() ||
				$('[itemprop="inAlbum"] [itemprop="name"]').text() ||
				null;
	return album;
};

Connector.playButtonSelector = 'div.playbutton:not(.playing)';

Connector.getTrackArt = () => {
	return $('#tralbumArt > a > img').attr('src') ||
	$('#detail_gallery_container img').attr('src') ||
	$('.discover-detail-inner img').attr('src');
};

Connector.getCurrentTime = () => {
	return $('audio')[0].currentTime;
};

Connector.getDuration = () => {
	return $('audio')[0].duration;
};

Connector.getUniqueID = () => {
	let match = /&id=(\d+)&/.exec($('audio').first().attr('src'));
	if (match) {
		return match[1];
	}
	return null;
};

Connector.filter = new MetadataFilter({
	all: [MetadataFilter.removeZeroWidth, MetadataFilter.trim]
});
