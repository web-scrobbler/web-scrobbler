'use strict';

/**
 * The last album thumbnail. Used for detecting new thumbnails.
 * @type {String}
 */
let lastAlbumThumbnail = null;

/**
 * Object that holds album title
 * @type {String}
 */
let albumTitle = null;

const filter = MetadataFilter.createFilter(
	MetadataFilter.createFilterSetForFields(
		['artist', 'track', 'albumArtist'],
		katakanaHanToZen
	)
);

Connector.playerSelector = '#audioPlayer';

Connector.artistSelector = '#artistNameAudio';

Connector.getAlbum = () => {
	requestAlbum();
	return albumTitle;
};

Connector.getTrackArt = () => Util.extractUrlFromCssProperty(document.querySelector('#jacketImageAudio').style['background-image']);

Connector.currentTimeSelector = '#currentTimeAudio';

Connector.durationSelector = '#durationTimeAudio';

Connector.trackSelector = '#titleAudio';

Connector.pauseButtonSelector = '.dm-pause';

Connector.applyFilter(filter);

/**
 * Helper functions.
 */

/**
 * Yes, this is extremely janky, and I apologize, but really blame tower for this one
 * To ensure the album can be found:
 * - album thumbnail is fetched from player
 * - the artist page of the artist is fetched
 * - the album list can then be crawled, and compared to find the one where thumbnail matches. Then fetch name there.
 *
 * A very hacky method is used to bypass the limitations of web scrobbler on asynchronous fetching of data
 */

async function fetchAlbumTitle() {

	const albumThumbnailBackground = document.querySelector('#jacketImageAudio').style['background-image'];
	const artistID = document.querySelector('#artistNameAudio').href.split('/').slice(-1)[0];
	const albumListURL = `https://music.tower.jp/artist/album/list/${artistID}`;

	const albumListString = await (await fetch(albumListURL)).text();
	const parser = new DOMParser();
	const albumListDocument = parser.parseFromString(albumListString, 'text/html');

	const albumList = albumListDocument.querySelectorAll('.c-media__image');

	for (const album of albumList) {
		if (album.style['background-image'] === albumThumbnailBackground) {
			return katakanaHanToZen(album.alt); // filter must be manually applied because it doesn't work when applied with metadatafilter
		}
	}

}

/**
 * Update current album title asynchronously.
 */
async function requestAlbum() {
	if (isNewAlbum()) {

		try {
			albumTitle = await fetchAlbumTitle();
		} catch (err) {
			Util.debugLog(`Error: ${err}`, 'error');

			resetAlbumTitle();
		}

	}
}

/**
 * Reset current album title.
 */
function resetAlbumTitle() {
	albumTitle = null;
}

/**
 * Check if album is changed.
 * @return {Boolean} True if new album is playing; false otherwise
 */
function isNewAlbum() {
	const albumThumbnail = document.querySelector('#jacketImageAudio').style['background-image'];

	if (lastAlbumThumbnail !== albumThumbnail) {
		lastAlbumThumbnail = albumThumbnail;
		return true;
	}

	return false;
}

/**
 * Replace half-width katakana with full-width katakana in the text.
 * @param  {String} text String to be filtered
 * @return {String} Filtered string
 */

const katakanaHanToZenMap = { '｡': '。', '｢': '「', '｣': '」', '､': '、', '･': '・', 'ｦ': 'ヲ', 'ｧ': 'ァ', 'ｨ': 'ィ', 'ｩ': 'ゥ', 'ｪ': 'ェ', 'ｫ': 'ォ', 'ｬ': 'ャ', 'ｭ': 'ュ', 'ｮ': 'ョ', 'ｯ': 'ッ', 'ｰ': 'ー', 'ｱ': 'ア', 'ｲ': 'イ', 'ｳ': 'ウ', 'ｴ': 'エ', 'ｵ': 'オ', 'ｶ': 'カ', 'ｷ': 'キ', 'ｸ': 'ク', 'ｹ': 'ケ', 'ｺ': 'コ', 'ｻ': 'サ', 'ｼ': 'シ', 'ｽ': 'ス', 'ｾ': 'セ', 'ｿ': 'ソ', 'ﾀ': 'タ', 'ﾁ': 'チ', 'ﾂ': 'ツ', 'ﾃ': 'テ', 'ﾄ': 'ト', 'ﾅ': 'ナ', 'ﾆ': 'ニ', 'ﾇ': 'ヌ', 'ﾈ': 'ネ', 'ﾉ': 'ノ', 'ﾊ': 'ハ', 'ﾋ': 'ヒ', 'ﾌ': 'フ', 'ﾍ': 'ヘ', 'ﾎ': 'ホ', 'ﾏ': 'マ', 'ﾐ': 'ミ', 'ﾑ': 'ム', 'ﾒ': 'メ', 'ﾓ': 'モ', 'ﾔ': 'ヤ', 'ﾕ': 'ユ', 'ﾖ': 'ヨ', 'ﾗ': 'ラ', 'ﾘ': 'リ', 'ﾙ': 'ル', 'ﾚ': 'レ', 'ﾛ': 'ロ', 'ﾜ': 'ワ', 'ﾝ': 'ン' };

function katakanaHanToZen(text) {

	let textOutput = '';

	for (const character of text) {
		const charCode = character.charCodeAt();

		if (charCode >= 65377 && charCode <= 65437) {
			textOutput += katakanaHanToZenMap[character];
		} else if (charCode === 65438 || charCode === 65439) {
			const lastCharCode = textOutput[textOutput.length - 1].charCodeAt();
			textOutput = textOutput.slice(0, -1) + String.fromCharCode(lastCharCode + charCode - 65437);
		} else {
			textOutput += character;
		}
	}
	return textOutput;
}
