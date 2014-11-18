'use strict';

/**
 * Wrapper to avoid using global Can
 *
 * Is there a way to get AMD version of Can with custom build?
 */
/* globals can */
define([
	'canjs'
], function() {
	return can;
});
