'use strict';

class SongFlags {
	constructor() {
		this.reset();
	}

	reset() {
		/**
		* Flag means song is scrobbled successfully.
		* @type {Boolean}
		*/
		this.isScrobbled = false;

		/**
		* Flag indicated song info is changed or approved by user.
		* @type {Boolean}
		*/
		this.isCorrectedByUser = false;

		/**
		* Flag indicated song is known by scrobbling service.
		* @type {Boolean}
		*/
		this.isValid = false;

		/**
		* Flag indicates song is marked as playing by controller.
		* @type {Boolean}
		*/
		this.isMarkedAsPlaying = false;

		/**
		* Flag means song is ignored by controller.
		* @type {Boolean}
		*/
		this.isSkipped = false;

		/**
		* Flag means song is replaying again.
		* @type {Boolean}
		*/
		this.isReplaying = false;
	}
}

define(() => {
	return SongFlags;
});
