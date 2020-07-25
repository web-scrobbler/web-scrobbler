<template>
	<div role="tabpanel">
		<div class="options-section">
			<h5>{{ L('tracksEditedTracks') }}</h5>

			<template v-if="areTracksLoaded">
				<p v-if="hasEditedTracks">
					{{ L('tracksEditedTracksDesc') }}
				</p>
				<p v-else>{{ L('tracksNoEditedTracks') }}</p>
			</template>
			<template v-else>
				<p>{{ L('loadingLabel') }}</p>
			</template>

			<div>
				<a
					href="#"
					class="card-link"
					@click.prevent="importEditedTracks()"
					>{{ L('buttonImport') }}</a
				>
				<a
					href="#"
					class="card-link"
					v-if="hasEditedTracks"
					@click.prevent="exportEditedTracks()"
				>
					{{ L('buttonExport') }}
				</a>
				<a
					href="#"
					class="card-link"
					v-if="hasEditedTracks"
					@click.prevent="clearEditedTracks()"
				>
					{{ L('buttonClear') }}
				</a>
			</div>
		</div>
		<div class="options-section" v-if="hasEditedTracks">
			<h5>{{ L('tracksEditedTracksCount', editedTracksCount) }}</h5>

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
						{{ L('buttonRemove') }}
					</a>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import TrackInfo from '@/ui/options/components/track-info.vue';

import SavedEdits from '@/background/storage/saved-edits';
import { exportData, importData } from '@/ui/util';

const exportFileName = 'edited-tracks.json';

export default {
	data() {
		return {
			editedTracks: {},
			areTracksLoaded: false,
		};
	},
	created() {
		this.loadEditedTracks();
	},
	components: { TrackInfo },
	computed: {
		editedTracksCount() {
			return Object.keys(this.editedTracks).length;
		},

		hasEditedTracks() {
			return this.editedTracksCount > 0;
		},
	},
	methods: {
		async loadEditedTracks() {
			this.editedTracks = await SavedEdits.getData();
			this.areTracksLoaded = true;
		},
		async exportEditedTracks() {
			exportData(this.editedTracks, exportFileName);
		},

		async importEditedTracks() {
			const data = await importData();

			this.editedTracks = Object.assign({}, this.editedTracks, data);
			await SavedEdits.updateData(this.editedTracks);
		},

		async clearEditedTracks() {
			this.editedTracks = {};
			await SavedEdits.clear();
		},

		async removeEntry(songId) {
			this.$delete(this.editedTracks, songId);
			await SavedEdits.saveData(this.editedTracks);
		},
	},
};
</script>
