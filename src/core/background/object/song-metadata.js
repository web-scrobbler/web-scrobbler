'use strict';

class SongMetadata {
	constructor() {
		this.reset();
	}

	reset() {
		/**
		 * Flag indicates song is loved by used on service.
		 * @type {Boolean}
		 */
		this.userloved = undefined;
		/**
		  * Time when song is started playing in UNIX timestamp format.
		  * @type {Number}
		  */
		this.startTimestamp = Math.floor(Date.now() / 1000);
	}
}

define(() => SongMetadata);
