<template>
	<base-modal
		@onClose="forwardEvent('onClose', $event)"
		@onOkClick="submitChanges"
	>
		<template v-slot:header> {{ L('editSongTitle') }} </template>
		<template v-slot:body>
			<div class="mb-3">
				<label class="form-label">{{ L('artistTitle') }}</label>
				<input
					required
					type="text"
					spellcheck="false"
					class="form-control"
					v-model.trim="artist"
					:placeholder="L('artistPlaceholder')"
				/>
			</div>
			<div class="mb-3">
				<label class="form-label">{{ L('trackTitle') }}</label>
				<input
					required
					type="text"
					spellcheck="false"
					class="form-control"
					v-model.trim="track"
					:placeholder="L('trackPlaceholder')"
				/>
			</div>
			<div class="mb-3">
				<label class="form-label">{{ L('albumTitle') }}</label>
				<input
					type="text"
					spellcheck="false"
					class="form-control"
					v-model.trim="album"
					:placeholder="L('albumPlaceholder')"
				/>
			</div>
			<div class="mb-3">
				<label class="form-label">{{ L('albumArtistTitle') }}</label>
				<input
					type="text"
					spellcheck="false"
					class="form-control"
					v-model.trim="albumArtist"
					:placeholder="L('albumArtistPlaceholder')"
				/>
			</div>
		</template>
	</base-modal>
</template>

<script>
import BaseModal from '@/ui/options/modals/base-modal.vue';

export default {
	props: { songInfo: Object },
	components: { BaseModal },
	data() {
		return {
			artist: null,
			track: null,
			album: null,
			albumArtist: null,
		};
	},
	created() {
		this.artist = this.songInfo.artist;
		this.track = this.songInfo.track;
		this.album = this.songInfo.album;
		this.albumArtist = this.songInfo.albumArtist;
	},
	methods: {
		submitChanges() {
			if (this.artist && this.track) {
				const songInfo = this.createEditedSongInfo();

				this.$emit('onOkClick', songInfo);
			}
		},

		createEditedSongInfo() {
			const { artist, track, album, albumArtist } = this;
			return { artist, track, album, albumArtist };
		},

		forwardEvent(name, data) {
			this.$emit(name, data);
		},
	},
};
</script>
