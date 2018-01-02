'use strict';

/** note: the discover page doesn't display the track artist for compilation albums.  This connector
	currently passes 'letious Artist' (or other letiant) as the artist name so tracks on albums with
	letious artists played on the discover page will most likely not be recognized.*/

// wire audio element to fire state changes
$('audio').bind('playing pause timeupdate', Connector.onStateChanged);

const separators = [' - ', ' | '];

function getArtist() {
	let artist = $('.bcweekly.playing').next().find('.bcweekly-current .track-artist:first a').text() ||
				$('.detail_item_link_2').text() ||
				$('span[itemprop=byArtist]').text() ||
				$('.detail-artist a').text() ||
				null;
	if (artist === null) {
		artist = $('.waypoint-artist-title').text().substr(3);
	}
	return artist;
}

function getTrack() {
	let track = $('.bcweekly.playing').next().find('.bcweekly-current .track-title:first').text() ||
				$('.track_info .title').first().text() ||
				$('.trackTitle').first().text() ||
				$('.collection-item-container.playing').find('.fav-track-static').first().text() ||
				$('.waypoint-item-title').text() ||
				$('.track_info .title');
	return track;
}

function isArtistLetious() {
	// Album page: true if all tracks contain a hyphen or vertical bar.
	// Example: http://tigersmilkrecords.bandcamp.com/album/peru-maravilloso-vintage-latin-tropical-cumbia
	if ($('meta[property="og:type"]').attr('content') === 'album') {
		let allDashed = true;
		$('.track_list span[itemprop="name"]').each(function() {
			if (!Util.findSeparator($(this).text(), separators)) {
				allDashed = false;
				return false;
			}
		});
		return allDashed;
	}

	// Discover & song pages: true if artist name is 'letious' or
	// 'letious Artists' and track contains a hyphen or vertical bar.
	// Also takes into account misspelling of letious as letios
	// Example: http://krefeld8ung.bandcamp.com/album/krefeld-8ung-vol-1
	return /^letiou?s(\sArtists)?$/.test(getArtist()) &&
		Util.findSeparator(getTrack(), separators) !== null;
}

Connector.getArtistTrack = () => {
	let artist = getArtist();
	let track = getTrack();

	if (isArtistLetious()) {
		return Util.splitArtistTrack(track, separators);
	}
	return { artist, track };
};

Connector.getAlbum = () => {
	let album = $('.bcweekly.playing').length && $('.bcweekly-current .track-album:first').text() ||
				$('.detail_item_link').text() ||
				$('h2.trackTitle').text() ||
				$('[itemprop="inAlbum"] [itemprop="name"]').text();
	return album;
};

Connector.isPlaying = () => $('.playing').length > 0;

Connector.getTrackArt = () => {
	return $('.bcweekly.playing').next().find('.bcweekly-current .ratio-1-1:first img').attr('src') ||
		$('#tralbumArt > a > img').attr('src') ||
		$('#detail_gallery_container img').attr('src') ||
		$('.discover-detail-inner img').attr('src');
};

Connector.getCurrentTime = () => {
	return $('.bcweekly.playing').length ? null : $('audio')[0].currentTime;
};

Connector.getDuration = () => {
	return $('.bcweekly.playing').length ? null : $('audio')[0].duration;
};

Connector.getUniqueID = () => {
	if ($('.bcweekly.playing').length) {
		return +location.search.match(/show=(\d+)?/)[1] === $('#pagedata').data('blob').bcw_show.show_id ? $('#pagedata').data('blob').bcw_show.tracks[$('.bcweekly-current').data('index')].track_id : null;
	}
	let match = /&id=(\d+)&/.exec($('audio').first().attr('src'));
	if (match) {
		return match[1];
	}
	return null;
};

Connector.filter = new MetadataFilter({
	all: [MetadataFilter.removeZeroWidth, MetadataFilter.trim]
});
