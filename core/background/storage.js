'use strict';

/**
 * Wrapper around nbubna/store
 */
define([
	'vendor/store2.min'
], function(store) {

	/**
	 * Storage namespace wrapper
	 *
	 * @param name
	 * @constructor
	 */
	var Namespace = function(name) {

		var nsStorage = store.namespace(name);

		this.get = function(property) {
			return nsStorage.get(property);
		};

		this.set = function(property, value) {
			nsStorage.set(property, value);
		};

		this.remove = function(key) {
			return nsStorage.remove(key);
		};

		this.has = function(key) {
			return nsStorage.has(key);
		};

	};


	return {
		/**
		 * Returns storage object for given namespace
		 *
		 * @return {Namespace}
		 */
		getNamespace: function(name) {
			return new Namespace(name);
		}
	};

});
