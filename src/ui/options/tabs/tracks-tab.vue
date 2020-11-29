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
						@click.prevent="removeEntry(songId)"
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

import { SavedEdits } from '@/background/storage/saved-edits';
import { exportData, importData } from '@/ui/util';
import { computed, onBeforeMount, ref, toRaw, watch } from 'vue';

const exportFileName = 'edited-tracks.json';

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
		editedTracks.value = await SavedEdits.getData();
		areTracksLoaded.value = true;

		watch(
			editedTracks,
			(newValue) => SavedEdits.saveData(toRaw(newValue)),
			{ deep: true }
		);
	});

	const editedTracksCount = computed(() => {
		return Object.keys(editedTracks.value).length;
	});
	const hasEditedTracks = computed(() => {
		return editedTracksCount.value > 0;
	});

	function exportEditedTracks() {
		exportData(toRaw(editedTracks), exportFileName);
	}

	async function importEditedTracks() {
		const importedData = await importData();

		editedTracks.value = Object.assign(
			{},
			toRaw(editedTracks),
			importedData
		);
	}

	function clearEditedTracks() {
		editedTracks.value = {};
	}

	function removeEntry(songId) {
		delete editedTracks.value[songId];
	}

	return {
		areTracksLoaded,
		editedTracks,
		editedTracksCount,
		hasEditedTracks,

		exportEditedTracks,
		importEditedTracks,

		clearEditedTracks,
		removeEntry,
	};
}
</script>
