export {};

// http://www.fileformat.info/info/unicode/category/Ps/list.htm
const rightBrackets =
	')|༻༽᚜‛‟⁆⁾₎⌉⌋〉❩❫❭❯❱❳❵⟆⟧⟩⟫⟭⟯⦄⦆⦈⦊⦌⦎⦐⦒⦔⦖⦘⧙⧛⧽⸣⸥⸧⸩⹃〉》」』】〕〗〙〛〞﵀︘︶︸︺︼︾﹀﹂﹄﹈﹚﹜﹞）＼｜｠｣';
const titleBrackets = '〉》」』】〕〗〙〛〞﵀︘︶︸︺︼︾﹀﹂﹄﹈';

Util.bindListeners(
	['audio', 'video'],
	['playing', 'pause', 'timeupdate'],
	Connector.onStateChanged
);

Connector.getTimeInfo = () => {
	const { duration, currentTime } = Util.queryElements([
		'audio',
		'video',
	])?.[0] as HTMLMediaElement;
	return { duration, currentTime };
};

Connector.isPlaying = () => {
	const media = Util.queryElements([
		'audio',
		'video',
	])?.[0] as HTMLMediaElement;
	return Boolean(media?.currentTime && !media.paused && !media.ended);
};

Connector.playerSelector = '.music_bg, .mv_box';

Connector.trackSelector = '.musicright_box2, #name_h3 a:first-child';

Connector.artistSelector = '.musicright_box3 a, #name_h3 a:last-child';

Connector.trackArtSelector = '#playimg';

Connector.getUniqueID = () => {
	const element = Util.queryElements('.li1 img')?.[0]?.closest('ul');
	const text = element?.getAttribute('id');
	const match = /id=(\d+)/g.exec(location.search);
	return (text && `a${text.slice(4)}`) || (match && `v${match[1]}`) || null;
};

const filter = MetadataFilter.createFilter({ track: filterTrack });

function filterTrack(text: string) {
	const regex = new RegExp(`^.*([${rightBrackets}]).*$`);

	const filteredText = text.replace(regex, filterBrackets);
	return filteredText.replace(/[\s_—－-][^_—－-]+(?:版|version|mv)\s*$/i, '');
}

function filterBrackets(text: string, bracket: string) {
	const i = text.lastIndexOf(bracket);
	const j = text.indexOf(String.fromCharCode(bracket.charCodeAt(0) - 1));
	const b = text.slice(j + 1, i);
	if (!/(?:版|version|mv)\s*$/i.test(b)) {
		return titleBrackets.includes(bracket) ? b : text;
	}

	const filteredText = Array.from(text);
	filteredText.splice(j, i - j + 1);

	return filteredText.join('');
}

Connector.applyFilter(filter);
