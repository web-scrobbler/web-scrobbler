export {};

interface State {
	_track: string | null;
	_artist: string | null;
	getUniqueID: string | null;
	getDuration: number | undefined;
	isPlaying: boolean;
	isStateChangeAllowed: boolean;
}

const state: State = {
	_track: null,
	_artist: null,
	getUniqueID: null,
	getDuration: undefined,
	isPlaying: false,
	isStateChangeAllowed: true,
};

for (const prop in state) {
	if (prop.startsWith('_')) {
		continue;
	}
	Object.defineProperty(Connector, prop, {
		value: () => state[prop as keyof State],
	});
}

Connector.onScriptEvent = (event) => {
	if (event.data.type === 'TELEGRAM_K_STATE') {
		const newState = event.data.state as State;
		for (const name in state) {
			Object.defineProperty(state, name, {
				value: newState[name as keyof State],
			});
		}
		Connector.onStateChanged();
	}
};

Connector.getArtistTrack = () => {
	const artist = state._artist;
	const track = state._track;
	if (artist === track) {
		return Util.splitArtistTrack(artist);
	}
	return { artist, track };
};

Connector.injectScript('connectors/telegram-k-dom-inject.js');

const filter = MetadataFilter.createFilter({
	track: trimSuffix,
});

Connector.applyFilter(filter);

function trimSuffix(track: string): string {
	const index = track.lastIndexOf('.');
	if (index === -1) {
		return track;
	}
	return track.substring(0, index);
}
