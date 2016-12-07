'use strict';

/* global Connector */

// Some pages have multiple playlists so the entire content section is observed for changes
Connector.playerSelector = '#content';

// store the type of page
var pageType = (function () {
	if ($('div.bcrumb h1 span.minitag-artist')[0]) {
		return 'artist';
	}
	if ($('div.bcrumb h1 span.minitag-album')[0]) {
		return 'album';
	}
	if ($('div.bcrumb h1 span.minitag-song')[0]) {
		return 'song';
	}
	if (location.href.split('/')[3] === 'search' || location.href.split('/')[3] === 'genre') {
		return 'searchOrGenre';
	}
	//the main page or blog pages, for example
	return 'other';
}());

//console.log('pageType = ' + pageType);

/** Returns the result of a regular expression search execution against an html comment.
 *    The html comment is present in album & song type pages and contains information
 *    about the artist and/or album.
 *
 * @param {RegExp} regEx - the regular expression used to match
 * @returns {String|null}
*/
function searchComment(regEx) {
	var result,
		pageDataNode = $('div.colr-sml-toppad').contents().filter(function () { return this.nodeType === 8; })[0];
	if (pageDataNode) {
		result = regEx.exec(pageDataNode.textContent);
		if (result) {
			return result[1];
		}
		return null;
	}
	return null;
}

Connector.isPlaying = function () {
	// console.log("isPlaying = " + Boolean($('.playbtn-paused')[0]));
	return Boolean($('.playbtn-paused')[0]);
};

Connector.getArtist = function () {
	/*jslint regexp: true*/
	switch (pageType) {
	case 'artist':
		return $('div.bcrumb h1').contents().filter(function () { return this.nodeType === 3; }).text();
	case 'album':
		// if there are two anchors in the .playtxt span then it uses the format "Artist - TrackName" (albums with Various Artists)
		if ($('div.gcol-electronic .playtxt a').length === 2) {
			return $('div.gcol-electronic .playtxt a').first().text();
		}
		return searchComment(/\[artist_name\] => (.+)/);
	case 'song':
		// return $('a[property="cc:attributionName"]').text();  //can't use, attribution isn't always present
		return searchComment(/\[artist_name\] => (.+)/);
	default:
		return $('div.gcol-electronic .playtxt a').first().text();
	}
};

Connector.getAlbum = function () {
	/*jslint regexp: true*/
	switch (pageType) {
	case 'artist':
	case 'album':
		return $('div.gcol-electronic').closest('.colr-lrg-10pad').find('h5.txthd2').text();
	case 'searchOrGenre':
		var albumName = $('div.gcol-electronic span.ptxt-album').text().trim().replace(/^\"|\"$/g, '');
		// Em-dash is used to show "no album" - Em-dash character code is 8212
		if (albumName.charCodeAt(0) === 8212) {
			return null;
		}
		return albumName;
	case 'song':
		// can't use breadcrumb since album title may be truncated,
		//  instead use an html comment that contains the album name
		return searchComment(/\[album_title\] => (.+)/);
	default:
		return null;
	}
};

Connector.getTrack = function () {
	switch (pageType) {
	case 'searchOrGenre':
		return $('div.gcol-electronic span.ptxt-track').text().replace(/^\"|\"$/g, '');
	default:
		//last anchor is used for 'other' page types where the Artist and song title are shown in the playlist
		return $('div.gcol-electronic span.playtxt a').last().text().trim().replace(/^\"|\"$/g, '');
	}
};

Connector.getDuration = function () {
	// the duration is in the last textNode
	var durStr = $('div.gcol-electronic span.playtxt').contents().filter(function () { return this.nodeType === 3; }).last().text().trim(),
		m = /(\d{2}):(\d{2})/.exec(durStr);
	if (m) {
		return parseInt(m[1], 10) * 60 + parseInt(m[2], 10);
	}
	return null;
};

Connector.getUniqueID = function () {
	var match = /(tid-\d+)/.exec($('div.play-item.gcol-electronic').attr('class'));
	if (match) {
		return match[0];
	}
	return null;
};
