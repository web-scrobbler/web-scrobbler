'use strict';

/**
 * Module for all communication with libre.fm
 */
define([
	'scrobblers/baseScrobbler',
	'objects/serviceCallResult'
], function (BaseScrobbler, ServiceCallResult) {

	var LibreFM = new BaseScrobbler({
		label: 'Libre.FM',
		storage: 'LibreFM',
		apiUrl: 'https://libre.fm/2.0/',
		apiKey: 'test',
		apiSecret: 'test',
		authUrl: 'https://www.libre.fm/api/auth/'
	});

	/**
	 * Overwrite default doRequest implementation due to API wanting the params encoded in the post body.
	 */
	LibreFM.doRequest = function (method, params, signed) {
		params.api_key = this.apiKey;

		if (signed) {
			params.api_sig = this.generateSign(params);
		}

		let queryStr = this.createQueryString(params);
		let url = `${this.apiUrl}?${queryStr}`;

		return new Promise((resolve, reject) => {
			let internalOkCb = (xmlDoc, status) => {
				console.log(`${this.label} response to ${url}: ${status}\n${new XMLSerializer().serializeToString(xmlDoc)}`);
				resolve($(xmlDoc));
			};

			let internalErrCb = (jqXHR, status, response) => {
				console.error(`${this.label} response to ${url}: ${status}\n${response}`);
				reject(new ServiceCallResult(ServiceCallResult.ERROR_OTHER));
			};

			if (method === 'GET') {
				$.get(url).done(internalOkCb).fail(internalErrCb);
			} else if (method === 'POST') {
				$.post(url, $.param(params)).done(internalOkCb).fail(internalErrCb);
			} else {
				reject(new ServiceCallResult(ServiceCallResult.ERROR_OTHER));
			}
		});
	}.bind(LibreFM);

	return LibreFM;
});
