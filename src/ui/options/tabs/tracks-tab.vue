<template>
	<div role="tabpanel">
		<div class="options-section">
			<h5>{{ L`tracksEditedTracks` }}</h5>

			<template v-if="areTracksLoaded">
				<p v-if="hasEditedTracks">
					{{ L`tracksEditedTracksDesc` }}
				</p>
				<p v-else>{{ L`tracksNoEditedTracks` }}</p>
			</template>
			<template v-else>
				<p>{{ L`loadingLabel` }}</p>
			</template>

			<div>
				<a
					href="#"
					class="card-link"
					@click.prevent="importEditedTracks()"
					>{{ L`buttonImport` }}</a
				>
				<a
					v-if="hasEditedTracks"
					href="#"
					class="card-link"
					@click.prevent="exportEditedTracks()"
				>
					{{ L`buttonExport` }}
				</a>
				<a
					v-if="hasEditedTracks"
					href="#"
					class="card-link"
					@click.prevent="clearEditedTracks()"
				>
					{{ L`buttonClear` }}
				</a>
			</div>
		</div>

		<storage-usage />

		<div v-if="hasEditedTracks" class="options-section">
			<h5>{{ L`tracksEditedTracksCount ${editedTracksCount}` }}</h5>

			<div
				class="mb-4"
				v-for="(songInfo, songId) in editedTracks"
				:key="songId"
			>
				<track-info
					:artist="songInfo.artist"
					:track="songInfo.track"
					:album="songInfo.album"
				/>
				<div>
					<a
						href="#"
						class="card-link"
						@click.prevent="removeEditedTrack(songId)"
					>
						{{ L`buttonRemove` }}
					</a>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import TrackInfo from '@/ui/options/components/track-info.vue';
import StorageUsage from '@/ui/options/components/storage-usage.vue';

import { exportData, importData } from '@/ui/util';
import { computed, onBeforeMount, ref } from 'vue';
import { createEditedTracksCommunicator } from '@/communication/CommunicatorFactory';

const exportFileName = 'edited-tracks.json';

const communicator = createEditedTracksCommunicator();

export default {
	components: { TrackInfo, StorageUsage },

	setup() {
		return useEditedTracks();
	},
};

function useEditedTracks() {
	const areTracksLoaded = ref(false);
	const editedTracks = ref({});

	onBeforeMount(async () => {
		editedTracks.value = await communicator.getEditedTracks();
		areTracksLoaded.value = true;
	});

	const editedTracksCount = computed(() => {
		return Object.keys(editedTracks.value).length;
	});
	const hasEditedTracks = computed(() => {
		return editedTracksCount.value > 0;
	});

	function exportEditedTracks() {
		exportData(editedTracks.value, exportFileName);
	}

	async function importEditedTracks() {
		const importedData = await importData();
		await communicator.importEditedTracks(importedData);

		editedTracks.value = await communicator.getEditedTracks();
	}

	async function clearEditedTracks() {
		editedTracks.value = {};
		await communicator.clearEditedTracks();
	}

	async function removeEditedTrack(songId) {
		delete editedTracks.value[songId];
		await communicator.removeEditedTrack(songId);
	}

	return {
		areTracksLoaded,
		editedTracks,
		editedTracksCount,
		hasEditedTracks,

		exportEditedTracks,
		importEditedTracks,

		clearEditedTracks,
		removeEditedTrack,
	};
}
</script>
