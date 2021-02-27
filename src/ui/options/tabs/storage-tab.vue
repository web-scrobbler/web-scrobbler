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
						@click.prevent="exportTracks()"
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

		<storage-usage />

		<div class="options-section" v-if="hasTracks">
			<h5>{{ L`storageScrobbleStorageCount ${tracksCount}` }}</h5>
			<div class="mb-4">
				<div
					class="mb-4"
					v-for="({ scrobbleable, scrobblerIds }, trackId) in tracks"
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
							{{ getDateString(scrobbleable.timestamp) }}
						</small>
					</div>
					<track-info
						:artist="scrobbleable.artist"
						:track="scrobbleable.track"
						:album="scrobbleable.album"
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
			:songInfo="editedInfo"
			@on-track-edited="updateTrackInfo"
			@on-modal-close="hideModal"
		/>
	</div>
</template>

<script>
import EditTrackModal from '@/ui/options/modals/edit-track-modal.vue';
import TrackInfo from '@/ui/options/components/track-info.vue';
import StorageUsage from '@/ui/options/components/storage-usage.vue';

import { exportData, importData } from '@/ui/util';
import { createScrobbleStorageCommunicator } from '@/communication/CommunicatorFactory';
import { getScrobblerLabel } from '@/background/scrobbler/ScrobblerLabel';
import { computed, ref } from 'vue';

const exportFileName = 'scrobble-storage.json';
const communicator = createScrobbleStorageCommunicator();

export default {
	components: { EditTrackModal, TrackInfo, StorageUsage },

	setup() {
		return useUnscrobbledTracks();
	},

	methods: {
		getScrobblerLabel(scrobblerId) {
			return getScrobblerLabel(scrobblerId);
		},

		getDateString(timestamp) {
			return new Date(timestamp * 1000).toLocaleString();
		},
	},
};

function useUnscrobbledTracks() {
	const areTracksLoaded = ref(false);
	const tracks = ref({});
	communicator.getUnscrobbledTracks().then((data) => {
		tracks.value = data;
		areTracksLoaded.value = true;
	});

	const tracksCount = computed(() => Object.keys(tracks.value).length);
	const hasTracks = computed(() => tracksCount.value > 0);

	async function removeTrack(entryId) {
		await communicator.deleteUnscrobbledTrack(entryId);
		delete tracks.value[entryId];
	}

	async function clearTracks() {
		await communicator.clearUnscrobbledTracks();
		tracks.value = {};
	}

	async function exportTracks() {
		exportData(tracks.value, exportFileName);
	}

	async function importTracks() {
		const importedData = await importData();
		await communicator.importUnscrobbledTracks(importedData);

		tracks.value = await communicator.getUnscrobbledTracks();
	}

	async function scrobbleTrack(entryId) {
		await communicator.scrobbleTrack(entryId);

		tracks.value = await communicator.getUnscrobbledTracks();
	}

	const isModalActive = ref(false);
	const editedInfo = ref({});
	const editedTrackId = ref(null);

	async function showModal(entryId) {
		const { scrobbleable } = await communicator.getTrack(entryId);
		editedInfo.value = scrobbleable;
		editedTrackId.value = entryId;

		isModalActive.value = true;
	}

	function hideModal() {
		isModalActive.value = false;
	}

	async function updateTrackInfo(trackInfo) {
		const newTrackInfo = Object.assign({}, editedInfo.value, trackInfo);
		await communicator.updateTrackInfo(editedTrackId.value, newTrackInfo);

		tracks.value = await communicator.getUnscrobbledTracks();
	}

	return {
		areTracksLoaded,
		tracks,

		removeTrack,
		clearTracks,

		exportTracks,
		importTracks,
		scrobbleTrack,

		tracksCount,
		hasTracks,

		isModalActive,

		editedInfo,
		editedTrackId,

		hideModal,
		showModal,
		updateTrackInfo,
	};
}
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
