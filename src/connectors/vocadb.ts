export {};

const filter = MetadataFilter.createFilter({
	artist: cleanupArtist,
});

Connector.applyFilter(filter);

function cleanupArtist(artist: string) {
	switch (location.hostname) {
		case 'vocadb.net':
			return artist.replace(/(?<=feat. ).+$/, function(match: string) {
				let feat = match.split(', ');
				for (let i = 0; i < feat.length; i++) {
					feat[i] = feat[i]
						.replace(/\s+\([^()]+\)/g, '')
						.replace(/(\s(V\d+X?|Append|English|AI|NT|Sugar|Spicy|ROCKS|2S|Standard|II|TALK)\b.*)+$/gi, '')
						.replace(/\s(ナチュラル|クール)$/gi, '')
						.replace(/^(AI|V\d+X?)+\s/gi, '')
						.replace(/^(VY\d+)V\d+\b/, '$1')
						.replace(/^結月ゆかり.+$/, '結月ゆかり')
						.replace(/^波音リツキレ$/, '波音リツ')
						.replace(/^星尘Infinity$/, '星尘')
						.replace(/^重音テトSV$/, '重音テト')
						.replace(/^遙$/, '夏語遙')
						.replace(/^v flower|v4 flower|Ci flower$/, 'flower')
						.trim();
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

Connector.playerSelector = '#app .css-1pm1wrk';
Connector.trackArtSelector = '.css-1no5jxy';
Connector.trackSelector = '.css-n3lbvk';
Connector.artistSelector = '.css-molfmb';
Connector.playButtonSelector = '.css-1lc7lii button[title="Play"]';

Connector.getDuration = () => {
	let store = getPlayQueueStore();
	let current = store.items[store.currentIndex];
	return current.entry.pvs[0].length;
};

function getPlayQueueStore() {
	return JSON.parse(localStorage.PlayQueueStore);
}
