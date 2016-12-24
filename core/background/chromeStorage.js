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

	function hideStringInText(str, text) {
		if (str) {
			return text.replace(str, 'xxxxx' + str.substr(5));
		}
		return text;
	}

	/**
	 * Logs all storage data to console
	 */
	function debugLog(namespace) {
		get(function(data) {
			let namespaceData = data[namespace];
			if (!namespaceData) {
				return;
			}

			let text = JSON.stringify(namespaceData, null, 2);
			// Hide 'token' and 'sessionID' values if available
			text = hideStringInText(namespaceData.token, text);
			text = hideStringInText(namespaceData.sessionID, text);

			console.info(`chrome.storage.local.${namespace} = ${text}`);
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
