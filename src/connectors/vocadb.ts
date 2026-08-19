export {};

const filter = MetadataFilter.createFilter({
	artist: cleanupArtist,
});

Connector.applyFilter(filter);

function cleanupArtist(artist: string) {
	switch (location.hostname) {
		case 'vocadb.net':
			return artist.replace(/(?<=feat. ).+$/, function (match: string) {
				const feat = match.split(', ');
				for (let i = 0; i < feat.length; i++) {
					feat[i] = feat[i]
						.replace(
							/^(結月ゆかり|音街ウナ|星尘|桜乃そら|重音テト|波音リツ).+$/,
							'$1',
						)
						.replace(/^(VY\d)V\d/, '$1')
						.replace(/^(IA) .+$/, '$1')
						.replace(/^.+ (flower)$/, '$1')
						.replace(/^遙$/, '夏語遙')
						.replace(/Megpoid/, 'GUMI')
						.replace(/\s\([^()]+\)/g, '')
						.replace(
							/\s?\b(Synthesizer V|Synthesizer V)( 2)?( Plus| AI)?\b\s?/g,
							'',
						)
						.replace(/^(AI|V\d+X?)\b\s?/g, '')
						.replace(
							/\s?\b(AI|V\d+X?|Append|English|Standard|II|2|V|SP|NT|Talk|TALK|VoiSona|SOLID|Arcane)\b.*$/g,
							'',
						)
						.replace(/\s(トークボイス)$/g, '');
				}
				return [...new Set(feat)].join(', ');
			});
			break;
		case 'utaitedb.net':
			return artist.replace(/^.+ feat\. /, '');
			break;
		default:
			return artist;
	}
}

Connector.playerSelector = '.css-1pm1wrk';

Connector.playButtonSelector = '.css-1lc7lii button[title=Play]';

interface Store {
	currentIndex: number;
	items: Array<Item>;
}

interface Item {
	entry: Entry;
	pvId: number;
}

interface Entry {
	artistString: string;
	id: number;
	name: string;
	pvs: Array<Pv>;
	urlThumb: string;
}

interface Pv {
	id: number;
	length: number;
	url: string;
}

Connector.getTrackInfo = () => {
	const store = getPlayQueueStore();
	const current = store?.items[store.currentIndex];
	const currentPv = current?.entry.pvs.filter(
		(pv) => pv.id === current.pvId,
	)[0];

	const data = {
		track: current?.entry.name,
		artist: current?.entry.artistString,
		uniqueID: current?.entry.id,
		duration: currentPv?.length,
		currentTime: (currentPv?.length || 0) * getPercentage(),
		trackArt: current?.entry.urlThumb,
		originUrl: currentPv?.url,
	};

	return data;
};

function getPercentage(): number {
	const progressBarElement = document.querySelector(
		'.css-1hasgzz',
	) as HTMLElement;
	const percentage = progressBarElement?.style.width;
	return parseFloat(percentage) / 100;
}

function getPlayQueueStore(): Store | null {
	if (!localStorage.PlayQueueStore) {
		return null;
	}

	return JSON.parse(localStorage.PlayQueueStore);
}
