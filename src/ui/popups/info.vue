<template>
	<div class="main-container" @click.alt="showDebugInfo()">
		<a class="album-art" :href="albumArt" target="_blank">
			<img
				class="album-art"
				alt="Cover art"
				:src="albumArt"
				:title="L`infoOpenAlbumArt`"
			/>
		</a>
		<div class="popup-container" v-if="isInfoMode && isSongAvailable">
			<div class="info-fields">
				<div class="song-field song-field--track">
					<a
						target="_blank"
						:href="song.metadata.trackUrl"
						:title="L`infoViewTrackPage`"
					>
						{{ track }}
					</a>
				</div>
				<div class="song-field">
					<a
						target="_blank"
						:href="song.metadata.artistUrl"
						:title="L`infoViewArtistPage`"
					>
						{{ artist }}
					</a>
				</div>
				<div class="song-field">
					<a
						target="_blank"
						:href="song.metadata.albumUrl"
						:title="L`infoViewAlbumPage`"
					>
						{{ album }}
					</a>
				</div>
				<div class="song-field">
					{{ albumArtist }}
				</div>
				<div class="tags">
					<span
						class="tag"
						v-if="song.metadata.userPlayCount > 0"
						:title="
							L`infoYourScrobbles ${song.metadata.userPlayCount}`
						"
					>
						<sprite-icon class="tag__icon" :icon="lastFm" />
						<span>{{ song.metadata.userPlayCount }}</span>
					</span>
					<span
						class="tag tag--overflow"
						:title="L`infoYouListeningVia ${label}`"
					>
						<sprite-icon
							class="tag__icon tag__icon--play-icon"
							:icon="playFill"
						/>
						<span>{{ label }}</span>
					</span>
				</div>
			</div>
			<div class="edit-controls">
				<button
					type="button"
					class="control-btn control-btn--default"
					:disabled="isTrackControlDisabled()"
					:title="L(editTitleId)"
					@click="setEditMode()"
				>
					<sprite-icon :icon="pencilSquare" />
				</button>
				<button
					type="button"
					class="control-btn control-btn--default"
					v-if="song.flags.isCorrectedByUser"
					:disabled="isTrackControlDisabled()"
					:title="L(revertTitleId)"
					@click="resetTrack()"
				>
					<sprite-icon :icon="arrowCounterClockwise" />
				</button>
				<button
					type="button"
					class="control-btn control-btn--unskip"
					v-if="song.flags.isSkipped"
					:title="L`infoSkippedTitle`"
				>
					<sprite-icon :icon="slashCircle" />
				</button>
				<button
					type="button"
					class="control-btn control-btn--skip"
					v-else
					:disabled="isTrackControlDisabled()"
					:title="L(skipTitleId)"
					@click="skipTrack"
				>
					<sprite-icon :icon="slashCircle" />
				</button>
				<button
					type="button"
					class="control-btn control-btn--unlove"
					v-if="isSongLoved"
					:title="L`infoUnlove`"
					@click="setTrackLoved(false)"
				>
					<sprite-icon :icon="heartFill" />
				</button>
				<button
					type="button"
					class="control-btn control-btn--love"
					v-else
					:title="L`infoLove`"
					@click="setTrackLoved(true)"
				>
					<sprite-icon :icon="heart" />
				</button>
			</div>
		</div>
		<div class="popup-container" v-if="isEditMode && isSongAvailable">
			<div class="edit-fields">
				<input
					type="text"
					tabindex="1"
					spellcheck="false"
					v-model.trim="track"
					:placeholder="L`trackPlaceholder`"
					@keyup.enter="checkAndSubmitChanges()"
				/>
				<input
					type="text"
					tabindex="2"
					spellcheck="false"
					v-model.trim="artist"
					:placeholder="L`artistPlaceholder`"
					@keyup.enter="checkAndSubmitChanges()"
				/>
				<input
					type="text"
					tabindex="3"
					spellcheck="false"
					v-model.trim="album"
					:placeholder="L`albumPlaceholder`"
					@keyup.enter="checkAndSubmitChanges()"
				/>
				<input
					type="text"
					tabindex="4"
					spellcheck="false"
					v-model.trim="albumArtist"
					:placeholder="L`albumArtistPlaceholder`"
					@keyup.enter="checkAndSubmitChanges()"
				/>
			</div>
			<div class="edit-controls">
				<button
					type="button"
					class="control-btn control-btn--submit"
					:disabled="isEditControlDisabled()"
					:title="L(submitTitleId)"
					@click="submitChanges()"
				>
					<sprite-icon :icon="check2Square" />
				</button>
				<button
					type="button"
					class="control-btn control-btn--default"
					:disabled="isEditControlDisabled()"
					:title="L(swapTitleId)"
					@click="swapArtistAndTrack()"
				>
					<sprite-icon :icon="arrowLeftRight" />
				</button>
			</div>
		</div>
		<div class="stub-container" v-if="!isSongAvailable">
			{{ L`infoNoSongInfoAvaiable` }}
		</div>
		<div
			class="debug-container"
			v-if="isDebugInfoVisible && isSongAvailable"
		>
			<pre>{{ song.toString() }}</pre>
		</div>
	</div>
</template>

<script>
import { browser } from 'webextension-polyfill-ts';

import { Song, LoveStatus } from '@/background/object/song';
import { Event, Request, sendMessageToActiveTab } from '@/common/messages';

import arrowCounterClockwise from 'bootstrap-icons/icons/arrow-counterclockwise.svg';
import arrowLeftRight from 'bootstrap-icons/icons/arrow-left-right.svg';
import check2Square from 'bootstrap-icons/icons/check2-square.svg';
import heart from 'bootstrap-icons/icons/heart.svg';
import heartFill from 'bootstrap-icons/icons/heart-fill.svg';
import lastFm from 'simple-icons/icons/last-dot-fm.svg';
import pencilSquare from 'bootstrap-icons/icons/pencil-square.svg';
import playFill from 'bootstrap-icons/icons/play-fill.svg';
import slashCircle from 'bootstrap-icons/icons/slash-circle.svg';

import SpriteIcon from '@/ui/shared/sprite-icon.vue';

const modeEdit = 0;
const modeInfo = 1;

const defaultTrackArt = '/icons/cover_art_default.png';

export default {
	data() {
		return {
			artist: null,
			track: null,
			album: null,
			albumArtist: null,

			mode: modeInfo,
			song: null,
			label: null,

			isDebugInfoVisible: false,

			arrowCounterClockwise,
			arrowLeftRight,
			check2Square,
			heart,
			heartFill,
			lastFm,
			pencilSquare,
			playFill,
			slashCircle,
		};
	},
	created() {
		browser.runtime.onMessage.addListener(this.onCoreMessage);

		sendMessageToActiveTab(Request.GetTrack).then((track) => {
			this.updateCurrentTrack(track);
		});
	},
	beforeDestroy() {
		browser.runtime.onMessage.removeListener(this.onCoreMessage);
	},
	components: { SpriteIcon },
	computed: {
		albumArt() {
			return (this.song && this.song.getTrackArt()) || defaultTrackArt;
		},

		editTitleId() {
			return this.isTrackControlDisabled()
				? 'infoEditUnableTitle'
				: 'infoEditTitle';
		},

		revertTitleId() {
			return this.isTrackControlDisabled()
				? 'infoRevertUnableTitle'
				: 'infoRevertTitle';
		},

		skipTitleId() {
			return this.isTrackControlDisabled()
				? 'infoSkipUnableTitle'
				: 'infoSkipTitle';
		},

		submitTitleId() {
			return this.isEditControlDisabled()
				? 'infoSubmitUnableTitle'
				: 'infoSubmitTitle';
		},

		swapTitleId() {
			return this.isEditControlDisabled()
				? 'infoSwapUnableTitle'
				: 'infoSwapTitle';
		},

		isEditMode() {
			return this.mode === modeEdit;
		},

		isInfoMode() {
			return this.mode === modeInfo;
		},

		isSongAvailable() {
			return this.song !== null;
		},

		isSongLoved() {
			return this.song.metadata.userloved === LoveStatus.Loved;
		},
	},
	methods: {
		/** Actions */

		checkAndSubmitChanges() {
			if (this.isEditControlDisabled()) {
				return;
			}

			this.submitChanges();
		},

		resetTrack() {
			sendMessageToActiveTab(Request.ResetTrack);
		},

		skipTrack() {
			sendMessageToActiveTab(Request.SkipTrack);
		},

		setTrackLoved(isLoved) {
			const loveStatus = isLoved ? LoveStatus.Loved : LoveStatus.Unloved;
			sendMessageToActiveTab(Request.ToggleLove, { loveStatus });
		},

		swapArtistAndTrack() {
			const { artist, track } = this;

			this.artist = track;
			this.track = artist;
		},

		submitChanges() {
			this.setInfoMode();

			if (!this.song.flags.isValid || this.isTrackInfoChanged()) {
				const track = {};
				for (const field of Song.BASE_FIELDS) {
					track[field] = this[field];
				}
				sendMessageToActiveTab(Request.CorrectTrack, { track });
			}
		},

		/** Controls */

		isEditControlDisabled() {
			return !(this.artist && this.track);
		},

		isTrackControlDisabled() {
			return this.song.flags.isScrobbled || this.song.flags.isSkipped;
		},

		/** View modes */

		setEditMode() {
			this.mode = modeEdit;
		},

		setInfoMode() {
			this.mode = modeInfo;
		},

		/** Misc */

		isTrackInfoChanged() {
			for (const fieldName of Song.BASE_FIELDS) {
				if (this[fieldName] !== this.song.getField(fieldName)) {
					return true;
				}
			}

			return false;
		},

		onCoreMessage(message) {
			if (message.type !== Event.TrackUpdated) {
				return;
			}
			this.updateCurrentTrack(message.data.track);
		},

		showDebugInfo() {
			this.isDebugInfoVisible = true;
		},

		async updateCurrentTrack(clonedData) {
			if (!clonedData) {
				this.song = null;
				return;
			}

			this.song = Song.wrap(clonedData);
			this.label = await sendMessageToActiveTab(
				Request.GetConnectorLabel
			);

			for (const fieldName of Song.BASE_FIELDS) {
				this[fieldName] = this.song.getField(fieldName);
			}

			if (this.song.isValid() || this.song.flags.isSkipped) {
				this.setInfoMode();
			} else {
				this.setEditMode();
			}
		},
	},
};
</script>

<style>
:root {
	--cover-art-size: 136px;
	--info-width: 224px;
}

/**
 * Generic.
 */

a {
	color: #212529;
	text-decoration: none;
}

body {
	background-color: #fff;
	color: #212529;
	font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
		'Helvetica Neue', Arial, sans-serif;
	font-size: 13px;
	margin: 0;
	overflow: hidden;
	padding: 0;
}

html {
	box-sizing: border-box;
}

input {
	font-family: inherit;
	width: 100%;
}

*,
*:before,
*:after {
	box-sizing: inherit;
}

/**
 * Containers.
 */

.main-container {
	display: grid;
	grid-template-columns: var(--cover-art-size) var(--info-width);
	min-height: var(--cover-art-size);
}

.popup-container {
	display: grid;
	grid-template-columns: var(--info-width);
	grid-template-rows: auto auto;
}

.debug-container {
	margin-left: 0.5rem;
	max-width: calc(var(--cover-art-size) + var(--info-width));
}

.stub-container {
	display: flex;
	font-size: 1.2rem;
	margin: auto;
	text-align: center;
}

/**
 * Controls.
 */

.album-art {
	grid-column: 1;
	grid-row: 1;
	height: var(--cover-art-size);
	width: var(--cover-art-size);
}

.edit-fields,
.info-fields {
	grid-column: 1;
	grid-row: 1;
	line-height: 1.4em;
	margin: 0.25rem 0.5rem;
}

.edit-controls {
	align-self: end;
	grid-column: 1;
	grid-row: 2;
	justify-self: start;
	margin: 0 0.5rem 0.25rem;
}

.song-field {
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.song-field--track {
	font-weight: 600;
}

.control-btn {
	background: none;
	border: none;
	color: #495053;
	cursor: pointer;
	margin-right: 0.5rem;
	outline: none;
	padding: 0rem;
	text-align: center;
	width: 1rem;
}

.control-btn[disabled] {
	color: #aaa !important;
	cursor: default !important;
}

.control-btn--default:hover {
	color: #247ba0;
}

.control-btn--love:hover {
	color: #d51007;
}

.control-btn--skip:hover {
	color: #d51007;
}

.control-btn--unlove {
	color: #d51007;
}

.control-btn--unlove:hover {
	color: #495053;
}

.control-btn--unskip {
	color: #d51007;
}

.control-btn--unskip:hover {
	cursor: default;
}

.control-btn--submit:hover {
	color: #65a858;
}

/**
 * Tags.
 */

.tags {
	display: flex;
	margin: 0 -0.1rem;
	margin-top: 0.25rem;
}

.tag {
	background-color: #247ba0;
	border-radius: 0.2rem;
	color: white;
	font-size: 0.75rem;
	height: 1.25rem;
	margin: 0 0.15rem;
	padding: 0 0.25rem;
	white-space: nowrap;
}

.tag--overflow {
	overflow: hidden;
	text-overflow: ellipsis;
}

.tag__icon {
	color: white;
	height: 1rem;
	margin-right: 0.25rem;
	vertical-align: bottom;
	width: 1rem;
}

.tag__icon--play-icon {
	/* Use smaller margin for `playFill` icon */
	margin-left: -0.15rem;
	margin-right: 0.1rem;
}
</style>
