'use strict';

const filter = MetadataFilter.createFilter(
	MetadataFilter.createFilterSetForFields(
		['artist', 'track', 'album', 'albumArtist'],
		katakanaHanToZen
	)
);

const katakanaHanToZenMap = { '｡': '。', '｢': '「', '｣': '」', '､': '、', '･': '・', 'ｦ': 'ヲ', 'ｧ': 'ァ', 'ｨ': 'ィ', 'ｩ': 'ゥ', 'ｪ': 'ェ', 'ｫ': 'ォ', 'ｬ': 'ャ', 'ｭ': 'ュ', 'ｮ': 'ョ', 'ｯ': 'ッ', 'ｰ': 'ー', 'ｱ': 'ア', 'ｲ': 'イ', 'ｳ': 'ウ', 'ｴ': 'エ', 'ｵ': 'オ', 'ｶ': 'カ', 'ｷ': 'キ', 'ｸ': 'ク', 'ｹ': 'ケ', 'ｺ': 'コ', 'ｻ': 'サ', 'ｼ': 'シ', 'ｽ': 'ス', 'ｾ': 'セ', 'ｿ': 'ソ', 'ﾀ': 'タ', 'ﾁ': 'チ', 'ﾂ': 'ツ', 'ﾃ': 'テ', 'ﾄ': 'ト', 'ﾅ': 'ナ', 'ﾆ': 'ニ', 'ﾇ': 'ヌ', 'ﾈ': 'ネ', 'ﾉ': 'ノ', 'ﾊ': 'ハ', 'ﾋ': 'ヒ', 'ﾌ': 'フ', 'ﾍ': 'ヘ', 'ﾎ': 'ホ', 'ﾏ': 'マ', 'ﾐ': 'ミ', 'ﾑ': 'ム', 'ﾒ': 'メ', 'ﾓ': 'モ', 'ﾔ': 'ヤ', 'ﾕ': 'ユ', 'ﾖ': 'ヨ', 'ﾗ': 'ラ', 'ﾘ': 'リ', 'ﾙ': 'ル', 'ﾚ': 'レ', 'ﾛ': 'ロ', 'ﾜ': 'ワ', 'ﾝ': 'ン' };

Connector.playerSelector = '#audioPlayer';

Connector.artistSelector = '#artistNameAudio';

Connector.getAlbum = () => document.querySelector('#jacketImageAudio').alt;

Connector.getTrackArt = () => Util.extractUrlFromCssProperty(document.querySelector('#jacketImageAudio').style['background-image']);

Connector.currentTimeSelector = '#currentTimeAudio';

Connector.durationSelector = '#durationTimeAudio';

Connector.trackSelector = '#titleAudio';

Connector.pauseButtonSelector = '.dm-pause';

Connector.applyFilter(filter);


/**
 * Replace half-width katakana with full-width katakana in the text.
 * @param  {String} text String to be filtered
 * @return {String} Filtered string
 */

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
