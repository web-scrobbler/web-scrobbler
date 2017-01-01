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
			params.api_key = this.apiKey;

			if (signed) {
				params.api_sig = this.generateSign(params);
			}

			let queryStr = $.param(params);
			let url = `${this.apiUrl}?${queryStr}`;

			return new Promise((resolve, reject) => {
				let internalOkCb = (xmlDoc, status) => {
					console.log(`${this.label} response to ${url}: ${status}\n${new XMLSerializer().serializeToString(xmlDoc)}`);
					resolve($(xmlDoc));
				};

				let internalErrCb = (jqXHR, status, response) => {
					console.error(`${this.label} response to ${url}: ${status}\n${response}`);
					reject(ServiceCallResult.OtherError());
				};

				if (method === 'GET') {
					$.get(url).done(internalOkCb).fail(internalErrCb);
				} else if (method === 'POST') {
					$.post(url, $.param(params)).done(internalOkCb).fail(internalErrCb);
				} else {
					reject(ServiceCallResult.OtherError());
				}
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
