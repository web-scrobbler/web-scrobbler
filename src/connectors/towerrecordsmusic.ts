export {};

/**
 * The last album thumbnail. Used for detecting new thumbnails.
 */
let lastAlbumThumbnail: string | null = null;

/**
 * Holds album title
 */
let albumTitle: string | null | undefined = null;

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

Connector.getTrackArt = () =>
	Util.extractUrlFromCssProperty(
		Util.getCSSPropertyFromSelectors(
			'#jacketImageAudio',
			'background-image'
		)
	);

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
	const albumThumbnailBackground = Util.getCSSPropertyFromSelectors(
		'#jacketImageAudio',
		'background-image'
	);
	const artistID = (
		document.querySelector('#artistNameAudio') as HTMLAnchorElement
	).href
		.split('/')
		.slice(-1)[0];
	const albumListURL = `https://music.tower.jp/artist/album/list/${artistID}`;

	const albumListString = await (await fetch(albumListURL)).text();
	const parser = new DOMParser();
	const albumListDocument = parser.parseFromString(
		albumListString,
		'text/html'
	);

	const albumList = albumListDocument.querySelectorAll(
		'.c-media__image'
	) as NodeListOf<HTMLImageElement>;

	for (const album of albumList) {
		if (
			Util.getCSSProperty(album, 'background-image') ===
			albumThumbnailBackground
		) {
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
 * @returns True if new album is playing; false otherwise
 */
function isNewAlbum() {
	const albumThumbnail = Util.getCSSPropertyFromSelectors(
		'#jacketImageAudio',
		'background-image'
	);

	if (lastAlbumThumbnail !== albumThumbnail) {
		lastAlbumThumbnail = albumThumbnail;
		return true;
	}

	return false;
}

/**
 * Replace half-width katakana with full-width katakana in the text.
 * @param text - String to be filtered
 * @returns Filtered string
 */

const katakanaHanToZenMap = {
	'｡': '。',
	'｢': '「',
	'｣': '」',
	'､': '、',
	'･': '・',
	ｦ: 'ヲ',
	ｧ: 'ァ',
	ｨ: 'ィ',
	ｩ: 'ゥ',
	ｪ: 'ェ',
	ｫ: 'ォ',
	ｬ: 'ャ',
	ｭ: 'ュ',
	ｮ: 'ョ',
	ｯ: 'ッ',
	ｰ: 'ー',
	ｱ: 'ア',
	ｲ: 'イ',
	ｳ: 'ウ',
	ｴ: 'エ',
	ｵ: 'オ',
	ｶ: 'カ',
	ｷ: 'キ',
	ｸ: 'ク',
	ｹ: 'ケ',
	ｺ: 'コ',
	ｻ: 'サ',
	ｼ: 'シ',
	ｽ: 'ス',
	ｾ: 'セ',
	ｿ: 'ソ',
	ﾀ: 'タ',
	ﾁ: 'チ',
	ﾂ: 'ツ',
	ﾃ: 'テ',
	ﾄ: 'ト',
	ﾅ: 'ナ',
	ﾆ: 'ニ',
	ﾇ: 'ヌ',
	ﾈ: 'ネ',
	ﾉ: 'ノ',
	ﾊ: 'ハ',
	ﾋ: 'ヒ',
	ﾌ: 'フ',
	ﾍ: 'ヘ',
	ﾎ: 'ホ',
	ﾏ: 'マ',
	ﾐ: 'ミ',
	ﾑ: 'ム',
	ﾒ: 'メ',
	ﾓ: 'モ',
	ﾔ: 'ヤ',
	ﾕ: 'ユ',
	ﾖ: 'ヨ',
	ﾗ: 'ラ',
	ﾘ: 'リ',
	ﾙ: 'ル',
	ﾚ: 'レ',
	ﾛ: 'ロ',
	ﾜ: 'ワ',
	ﾝ: 'ン',
};

function katakanaHanToZen(text: string) {
	let textOutput = '';

	for (const character of text) {
		const charCode = character.charCodeAt(0);

		if (character in katakanaHanToZenMap) {
			textOutput +=
				katakanaHanToZenMap[
					character as keyof typeof katakanaHanToZenMap
				];
		} else if (charCode === 65438 || charCode === 65439) {
			const lastCharCode =
				textOutput[textOutput.length - 1].charCodeAt(0);
			textOutput =
				textOutput.slice(0, -1) +
				String.fromCharCode(lastCharCode + charCode - 65437);
		} else {
			textOutput += character;
		}
	}
	return textOutput;
}
