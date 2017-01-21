'use strict';

/**
 * Module for all communication with libre.fm
 */
define([
	'jquery',
	'scrobblers/baseScrobbler',
	'objects/serviceCallResult'
], function ($, BaseScrobbler, ServiceCallResult) {
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
					let responseStr = new XMLSerializer().serializeToString(xmlDoc);
					console.log(`${this.label} ${params.method} response:\n${responseStr}`);
					resolve($(xmlDoc));
				}).fail((jqXHR, status, responseStr) => {
					console.error(`${this.label}${params.method} response:\n${responseStr}`);
					reject(ServiceCallResult.OtherError());
				});
			});
		}
	}

	return new LibreFm({
		label: 'Libre.FM',
		storage: 'LibreFM',
		apiUrl: 'https://libre.fm/2.0/',
		apiKey: 'test',
		apiSecret: 'test',
		authUrl: 'https://www.libre.fm/api/auth/'
	});
});
