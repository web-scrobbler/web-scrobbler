'use strict';

/**
 * Can.Map object stub.
 */
class MapStub {
	constructor(map) {
		for (let key in map) {
			this[key] = map[key];
		}
	}
}

define([], function() {
	return { 'Map': MapStub };
});
