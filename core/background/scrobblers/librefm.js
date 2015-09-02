'use strict';

/**
 * Module for all communication with libre.fm
 */
define([
	'scrobblers/baseScrobbler'
], function (BaseScrobbler) {

	var LibreFM = new BaseScrobbler({
		label: 'Libre.FM',
		storage: 'LibreFM',
		apiUrl: 'https://libre.fm/2.0/',
		apiKey: 'test',
		apiSecret: 'test',
		authUrl: 'http://www.libre.fm/api/auth/'
	});

	LibreFM.doRequest = function (method, params, signed, okCb, errCb) {
		var self = this;
		params.api_key = this.apiKey;

		if (signed) {
			params.api_sig = this.generateSign(params);
		}

		var paramPairs = [];
		for (var key in params) {
			if (params.hasOwnProperty(key)) {
				paramPairs.push(key + '=' + encodeURIComponent(params[key]));
			}
		}

		var url = this.apiUrl + '?' + paramPairs.join('&');

		var internalOkCb = function (xmlDoc, status) {
			if (self.enableLogging) {
				console.info(self.label + ' response to ' + method + ' ' + url + ' : ' + status + '\n' + (new XMLSerializer()).serializeToString(xmlDoc));
			}

			okCb.apply(this, arguments);
		};

		var internalErrCb = function (jqXHR, status, response) {
			if (self.enableLogging) {
				console.error(self.label + ' response to ' + url + ' : ' + status + '\n' + response);
			}

			errCb.apply(this, arguments);
		};

		if (method === 'GET') {
			$.get(url)
				.done(internalOkCb)
				.fail(internalErrCb);
		} else if (method === 'POST') {
			$.post(url, $.param(params))
				.done(internalOkCb)
				.fail(internalErrCb);
		} else {
			console.error('Unknown method: ' + method);
		}
	}.bind(LibreFM);


	return LibreFM;
});
