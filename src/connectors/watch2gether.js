"use strict";

new (class {
	playButton = document.querySelectorAll(
		`[data-w2g="['video.playing', ['css', ['pause icon','play icon']]]"]`
	)[0];
	currentTimeSelector = `[data-w2g="['video.timeString', 'text']"]`;
	timeTarget = document.querySelector("#player-time");
	durationSelector = `[data-w2g="['video.duration', 'text']"]`;
	_track = {};

	constructor() {
		Connector.isPlaying = () => this.isPlaying;
		Connector.getArtistTrack = () => this.track.info;
		Connector.getUniqueID = () => this.track.id;
		Connector.currentTimeSelector = this.currentTimeSelector;
		Connector.durationSelector = this.durationSelector;

		let observer = new MutationObserver(() => this.updateState());

		observer.observe(this.playButton, {
			attributes: true
		});

		observer.observe(this.timeTarget, {
			childList: true,
			subtree: true,
			attributes: true
		});
	}

	get track() {
		return this._track;
	}

	set track(track) {
		this._track = {
			url: track.url,
			info: track.info,
			id: track.id
		};

		Connector.onStateChanged();
	}

	get isPlaying() {
		return this.playButton && !this.playButton.classList.contains("play");
	}

	getVideoId(link, type) {
		let id = `${type}:${link}`;

		switch (type) {
			case "youtube":
				id = Util.getYoutubeVideoIdFromUrl(link);
		}

		return id;
	}

	updateState() {
		let elements = document.querySelectorAll(".w2g-chat-provider");
		let element = [...elements]
			.reverse()
			.filter(e => e.classList.length > 1)[0];

		if (!element) {
			return;
		}

		let type = element.classList[1] || "unknown";
		let infoElement = element.nextElementSibling;
		let title = $("<div></div>").html(infoElement.innerText)[0].textContent;

		this.track = {
			url: infoElement.href,
			info: Util.processYoutubeVideoTitle(title),
			id: this.getVideoId(infoElement.href, type)
		};
	}
})();
