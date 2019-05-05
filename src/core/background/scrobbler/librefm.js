'use strict';

/**
 * Module for all communication with libre.fm
 */
define((require) => {
	const $ = require('jquery');
	const AudioScrobbler = require('scrobbler/audioscrobbler');
	const ServiceCallResult = require('object/service-call-result');

	class LibreFm extends AudioScrobbler {
		/** @override */
		sendRequest(method, params, signed) {
			if ('post' !== method.toLowerCase()) {
				return super.sendRequest(method, params, signed);
			}

			const url = this.makeRequestUrl(params, signed);

			return new Promise((resolve, reject) => {
				$.post(url, $.param(params)).done((xmlDoc) => {
					let text = new XMLSerializer().serializeToString(xmlDoc);
					this.debugLog(`${params.method} response:\n${text}`);
					resolve($(xmlDoc));
				}).fail((jqXHR, status, text) => {
					this.debugLog(`${params.method} response:\n${text}`, 'error');
					reject(new ServiceCallResult(ServiceCallResult.ERROR_OTHER));
				});
			});
		}
	}

	return new LibreFm({
		label: 'Libre.fm',
		storage: 'LibreFM',
		apiUrl: 'https://libre.fm/2.0/',
		apiKey: 'r8i1y91hz71tcx7vyrp9hk1alhqp1898',
		apiSecret: '8187db5vg234yq6tm7o62q8mtl1niala',
		authUrl: 'https://www.libre.fm/api/auth/',
		statusUrl: null,
		profileUrl: 'https://libre.fm/user/',
	});
});
