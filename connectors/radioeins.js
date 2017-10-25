'use strict';

Connector.playerSelector = '.livestream';

Connector.artistSelector = 'p.artist';

Connector.trackSelector = 'p.songtitle';

Connector.isPlaying = () => {
	let ret = false;
	if ($('#lsplayer audio') && $('#lsplayer audio').length) {
		ret = !$('#lsplayer audio')[0].paused;
	} else {
		let state = retrieveJwplayerState();
		ret = (typeof state === 'string') && (state.toUpperCase() === 'PLAYING');
	}
	return ret;
};

function retrieveJwplayerState() {
	let scriptContent = 'if (typeof jwplayer === "function") $("body").attr("tmp_state", typeof jwplayer().getState === "function" ? jwplayer().getState() : "");\n';

	let script = document.createElement('script');
	script.id = 'tmpScript';
	script.appendChild(document.createTextNode(scriptContent));
	(document.body || document.head || document.documentElement).appendChild(script);

	let ret = $('body').attr('tmp_state');

	$('body').removeAttr('tmp_state');
	$('#tmpScript').remove();

	return ret;
}
