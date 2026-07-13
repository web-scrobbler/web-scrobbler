export {};

interface State {
	getTrack: string | null;
	getArtist: string | null;
	getTrackArt: string | null;
	isPlaying: boolean;
}

const state: State = {
	getTrack: null,
	getArtist: null,
	getTrackArt: null,
	isPlaying: false,
};

for (const prop in state) {
	Object.defineProperty(Connector, prop, {
		value: () => state[prop as keyof State],
	});
}

Connector.onScriptEvent = (event) => {
	if (event.data.type === 'ILOVEMUSIC_STATE') {
		const newState = event.data.state as State;
		for (const name in state) {
			Object.defineProperty(state, name, {
				value: newState[name as keyof State],
			});
		}
		Connector.onStateChanged();
	}
};

Connector.injectScript('connectors/ilovemusic-dom-inject.js');
