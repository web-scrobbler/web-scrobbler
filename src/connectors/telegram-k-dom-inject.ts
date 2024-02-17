type AttributeAudio = {
	title?: string;
	performer?: string;
};

type AttributeFilename = {
	file_name: string;
};

type Attribute = AttributeAudio | AttributeFilename;

interface Document {
	id: string;
	duration: number;
	type: 'audio' | 'round' | 'voice';
	attributes: Attribute[];
}

interface Details {
	doc: Document;
	media: HTMLAudioElement | HTMLVideoElement;
}

interface MediaController {
	getPlayingDetails: () => Details;
	addEventListener: (_: string, __: () => void) => void;
	removeEventListener: (_: string, __: () => void) => void;
}

interface Window {
	appMediaPlaybackController: MediaController;
}

if ('cleanup' in window && typeof window.cleanup === 'function') {
	window.cleanup();
}

(window as unknown as { cleanup: () => void }).cleanup = (() => {
	const W = window as unknown as Window;

	function extractAttributes(attributes: Attribute[]) {
		const data: { [key: string]: string | undefined } = {};
		for (const attribute of attributes) {
			for (const key in attribute) {
				data[key] = attribute[key as keyof Attribute];
			}
		}
		return data;
	}

	function listener() {
		const details = W.appMediaPlaybackController.getPlayingDetails();
		const attribute = extractAttributes(details.doc.attributes);
		const { file_name: fileName } = attribute;
		window.postMessage(
			{
				sender: 'web-scrobbler',
				type: 'TELEGRAM_K_STATE',
				state: {
					_track: attribute.title || fileName,
					_artist: attribute.performer || fileName,
					getUniqueID: details.doc.id,
					getDuration: details.doc.duration,
					isPlaying: details.media.paused === false,
					isStateChangeAllowed: details.doc.type === 'audio',
				},
			},
			'*',
		);
	}

	function toggleEventListeners(name: string) {
		const api = W.appMediaPlaybackController;
		const method = `${name}EventListener` as keyof MediaController;
		const events = ['play', 'pause'];
		for (const event of events) {
			api[method](event, listener);
		}
	}

	const observer = new MutationObserver(() => {
		if ('appMediaPlaybackController' in W) {
			observer.disconnect();
			toggleEventListeners('add');
		}
	});

	observer.observe(document.body, { childList: true });

	return () => {
		observer.disconnect();
		toggleEventListeners('remove');
	};
})();
