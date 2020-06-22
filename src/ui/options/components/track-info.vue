<template>
	<div class="mb-2">
		<div class="artist-track">
			{{ artist }} — {{ track }}
		</div>
		<div class="album" v-if="album">
			{{ L('albumTooltip', album) }}
		</div>
	</div>
</template>

<script>
export default {
	props: {
		artist: String,
		track: String,
		album: String,
	},
};
</script>

<style>
.album {
	font-size: 85%;
}
</style>
