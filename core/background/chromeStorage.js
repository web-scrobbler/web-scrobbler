'use strict';

/**
 * Wrapper around chrome.storage
 */
define([
	'wrappers/chrome'
], function(chrome) {

	/**
	 * Storage namespace wrapper
	 *
	 * @param name
	 * @constructor
	 */
	var Namespace = function(name) {

		this.get = function(cb) {
			chrome.storage.local.get(name, function(o) {
				if (chrome.runtime.lastError) {
					console.error('ChromeStorage.Namespace.getData : ' + chrome.runtime.lastError);
					return;
				}

				if (o && o.hasOwnProperty(name)) {
					cb(o[name]);
				} else {
					cb({});
				}
			});
		};

		this.set = function(data, cb) {
			var d = {};
			d[name] = data;

			var innerCb = function() {
				if (chrome.runtime.lastError) {
					console.error('ChromeStorage.Namespace.setData : ' + chrome.runtime.lastError);
					return;
				}

				if (typeof(cb) === 'function') {
					cb();
				}
			};

			chrome.storage.local.set(d, innerCb);
		};

	};

	/**
	 * Returns all data in the storage
	 */
	function get(cb) {
		chrome.storage.local.get(function(o) {
			if (chrome.runtime.lastError) {
				console.error('ChromeStorage.getData : ' + chrome.runtime.lastError);
				return;
			}

			cb(o);
		});
	}

	/**
	 * Sets data on global level.
	 * Be careful, this can overwrite any namespaced data
	 */
	function set(data, cb) {
		var innerCb = function() {
			if (chrome.runtime.lastError) {
				console.error('ChromeStorage.setData : ' + chrome.runtime.lastError);
				return;
			}

			if (typeof(cb) === 'function') {
				cb();
			}
		};

		chrome.storage.local.set(data, innerCb);
	}

	/**
	 * Logs all storage data to console
	 */
	function debugLog() {
		get(function(data) {
			var text = JSON.stringify(data);
			if (data !== null && Object.keys(data).length > 0 && data.LastFM) {
				if (data.LastFM.token) {
					text = text.replace(data.LastFM.token, 'xxxxx' + data.LastFM.token.substr(5));
				}
				if (data.LastFM.sessionID) {
					text = text.replace(data.LastFM.sessionID, 'xxxxx' + data.LastFM.sessionID.substr(5));
				}
			}
			console.info('chrome.storage.local = ' + text);
		});
	}


	return {
		/**
		 * Returns storage object for given namespace
		 *
		 * @return {Namespace}
		 */
		getNamespace: function(name) {
			return new Namespace(name);
		},

		debugLog: debugLog,
		get: get,
		set: set
	};

});
