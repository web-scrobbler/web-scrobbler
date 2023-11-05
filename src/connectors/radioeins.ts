export {};

Connector.playerSelector = '.livestream';

Connector.artistSelector = 'p.artist';

Connector.trackSelector = 'p.songtitle';

Connector.isPlaying = () => {
	let ret = false;
	if (document.querySelector('.audioplayer-playing')) {
		ret = true;
	} else if (document.querySelector('.audioplayer-stopped')) {
		ret = false;
	} else if (document.querySelector('#lsplayer audio')) {
		ret = !(document.querySelector('#lsplayer audio') as HTMLAudioElement)
			?.paused;
	} else {
		const state = retrieveJwplayerState();
		ret = typeof state === 'string' && state.toUpperCase() === 'PLAYING';
	}
	return ret;
};

function retrieveJwplayerState() {
	const scriptContent =
		'if (typeof jwplayer === "function") $("body").attr("tmp_state", typeof jwplayer().getState === "function" ? jwplayer().getState() : "");\n';

	const script = document.createElement('script');
	script.id = 'tmpScript';
	script.appendChild(document.createTextNode(scriptContent));
	(document.body || document.head || document.documentElement).appendChild(
		script,
	);

	const ret = Util.getAttrFromSelectors('body', 'tmp_state');

	document.querySelector('body')?.removeAttribute('tmp_state');
	document.querySelector('#tmpScript')?.remove();

	return ret;
}
