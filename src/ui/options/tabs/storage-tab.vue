<template>
	<div role="tabpanel">
		<div class="options-section">
			<h5>{{ L`storageScrobbleStorageTitle` }}</h5>

			<template v-if="areTracksLoaded">
				<p v-if="hasTracks">
					{{ L`storageScrobbleStorageDescDefault` }}
				</p>
				<p v-else>{{ L`storageScrobbleStorageDescNoSongs` }}</p>
			</template>
			<template v-else>
				<p>{{ L`loadingLabel` }}</p>
			</template>

			<div class="mb-4" v-if="areTracksLoaded">
				<a href="#" class="card-link" @click.prevent="importTracks()">
					{{ L`buttonImport` }}
				</a>
				<template v-if="hasTracks">
					<a
						href="#"
						class="card-link"
						@click.prevent="exporTracks()"
					>
						{{ L`buttonExport` }}
					</a>
					<a
						href="#"
						class="card-link"
						@click.prevent="clearTracks()"
					>
						{{ L`buttonClear` }}
					</a>
				</template>
			</div>
		</div>

		<div
			v-if="isAlertVisible"
			class="alert alert-danger alert-dismissible"
			role="alert"
		>
			{{ alertMessage }}
			<button
				type="button"
				class="close"
				aria-label="Close"
				@click="isAlertVisible = false"
			>
				<span aria-hidden="true">&times;</span>
			</button>
		</div>

		<div class="options-section" v-if="hasTracks">
			<h5>{{ L`storageScrobbleStorageCount ${tracksCount}` }}</h5>
			<div class="mb-4">
				<div
					class="mb-4"
					v-for="({ songInfo, scrobblerIds }, trackId) in tracks"
					:key="trackId"
				>
					<div
						class="info-container mb-2 d-flex justify-content-between align-items-center"
					>
						<div class="scrobbler-labels">
							<span
								class="badge badge-primary"
								v-bind:class="{ [scrobblerId]: true }"
								v-for="scrobblerId in scrobblerIds"
								:key="scrobblerId"
							>
								{{ getScrobblerLabel(scrobblerId) }}
							</span>
						</div>
						<small class="date text-muted">
							{{ getDateString(songInfo.timestamp) }}
						</small>
					</div>
					<track-info
						:artist="songInfo.artist"
						:track="songInfo.track"
						:album="songInfo.album"
					/>
					<div>
						<a
							class="card-link"
							href="#"
							@click.prevent="showModal(trackId)"
						>
							{{ L`buttonEdit` }}
						</a>
						<a
							class="card-link"
							href="#"
							@click.prevent="scrobbleTrack(trackId)"
						>
							{{ L`buttonScrobble` }}
						</a>
						<a
							class="card-link"
							href="#"
							@click.prevent="removeTrack(trackId)"
						>
							{{ L`buttonRemove` }}
						</a>
					</div>
				</div>
			</div>
		</div>

		<edit-track-modal
			v-if="isModalActive"
			:songInfo="editedSongInfo"
			@onOkClick="updateSongInfo"
			@onClose="hideModal"
		/>
	</div>
</template>

<script>
import EditTrackModal from '@/ui/options/modals/edit-track-modal.vue';
import TrackInfo from '@/ui/options/components/track-info.vue';

import { ApiCallResult } from '@/background/scrobbler/api-call-result';
import { ScrobbleManager } from '@/background/scrobbler/scrobble-manager';
import { ScrobbleStorage } from '@/background/storage/scrobble-storage';

import { exportData, importData } from '@/ui/util';

const exportFileName = 'scrobble-storage.json';

export default {
	data() {
		return {
			tracks: {},
			areTracksLoaded: false,

			editedTrackId: null,
			editedSongInfo: {},
			isModalActive: false,

			alertMessage: null,
			isAlertVisible: false,
		};
	},
	created() {
		this.loadTracksFromStorage();
	},
	components: {
		EditTrackModal,
		TrackInfo,
	},
	computed: {
		tracksCount() {
			return Object.keys(this.tracks).length;
		},

		hasTracks() {
			return this.tracksCount > 0;
		},
	},
	watch: {
		tracks: {
			handler(data) {
				this.saveTracksToStorage(data);
			},
			deep: true,
		},
	},
	methods: {
		async loadTracksFromStorage() {
			this.tracks = await ScrobbleStorage.getData();
			this.areTracksLoaded = true;
		},

		async saveTracksToStorage() {
			await ScrobbleStorage.saveData(this.tracks);
		},

		async exporTracks() {
			exportData(this.tracks, exportFileName);
		},

		async importTracks() {
			const data = await importData();

			this.tracks = data;
		},

		showError(text) {
			this.alertMessage = text;
			this.isAlertVisible = true;
		},

		getDateString(timestamp) {
			return new Date(timestamp * 1000).toLocaleString();
		},

		getScrobblerLabel(scrobblerId) {
			return ScrobbleManager.getScrobblerById(scrobblerId).getLabel();
		},

		async clearTracks() {
			this.tracks = {};
			await ScrobbleStorage.clear();
		},

		async scrobbleTrack(trackId) {
			const { songInfo, scrobblerIds } = this.tracks[trackId];
			const results = await ScrobbleManager.scrobbleWithScrobblers(
				songInfo,
				scrobblerIds
			);

			const okScrobblersIds = [];
			const failedScrobblerIds = [];

			for (const result of results) {
				const scrobblerId = result.getScrobblerId();

				if (result.is(ApiCallResult.RESULT_OK)) {
					okScrobblersIds.push(scrobblerId);
				} else {
					failedScrobblerIds.push(scrobblerId);
				}
			}

			const areAllResultsOk = okScrobblersIds.length === results.length;

			if (areAllResultsOk) {
				this.removeTrack(trackId);
			} else {
				const isNeedToUpdateScrobblerIds = okScrobblersIds.length > 0;
				if (isNeedToUpdateScrobblerIds) {
					await this.updateScrobblerIds(trackId, failedScrobblerIds);
				}

				const scrobblerLabels = this.getScrobblerLabels(
					failedScrobblerIds
				);
				const labelsList = scrobblerLabels.join(', ');

				this.showError(this.L`unableToScrobble ${labelsList}`);
			}
		},

		async removeTrack(trackId) {
			delete this.tracks[trackId];
		},

		async updateScrobblerIds(trackId, scrobblerIds) {
			const { songInfo } = this.tracks[trackId];

			this.tracks[trackId] = { songInfo, scrobblerIds };
		},

		async updateSongInfo(editedSongInfo) {
			const trackId = this.editedTrackId;
			const { songInfo, scrobblerIds } = this.tracks[trackId];

			this.tracks[trackId] = {
				songInfo: Object.assign({}, songInfo, editedSongInfo),
				scrobblerIds,
			};
		},

		showModal(trackId) {
			const { songInfo } = this.tracks[trackId];

			this.editedTrackId = trackId;
			this.editedSongInfo = songInfo;
			this.isModalActive = true;
		},

		hideModal() {
			this.isModalActive = false;
		},
	},
};
</script>

<style>
.scrobbler-labels .badge {
	margin-right: 0.25rem;
}

.lastfm {
	background-color: #ba0000;
}

.librefm {
	background-color: #f67900;
}

.listenbrainz {
	background-color: #353070;
}

@media (max-width: 500px) {
	.date {
		display: none;
	}
}
</style>
