'use strict';

/**
 * Module for all communication with libre.fm
 */
define([
	'jquery',
	'scrobblers/baseScrobbler',
	'objects/serviceCallResult'
], function($, BaseScrobbler, ServiceCallResult) {
	class LibreFm extends BaseScrobbler {
		doRequest(method, params, signed) {
			if ('post' !== method.toLowerCase()) {
				return super.doRequest(method, params, signed);
			}

			params.api_key = this.apiKey;

			if (signed) {
				params.api_sig = this.generateSign(params);
			}

			let queryStr = $.param(params);
			let url = `${this.apiUrl}?${queryStr}`;

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
		profileUrl: 'https://libre.fm/user/',
	});
});
