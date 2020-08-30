<template>
	<base-popup>
		<template v-slot:icon>
			<sprite-icon :icon="musicNoteList" class="popup-icon" />
		</template>
		<template v-slot:title>{{ L`getStartedHeader` }}</template>
		<template v-slot:body>
			<p v-if="!isDescriptionVisible" class="mb-0">
				<a href="#" class="card-link" @click="showDescription">{{
					L`getStartedSubheader`
				}}</a>
			</p>

			<div v-if="isDescriptionVisible" class="mt-2">
				<p class="description">{{ L`getStartedSiteChanged` }}</p>
				<p class="description">{{ L`getStartedSubmitIssue` }}</p>
				<a
					class="card-link"
					role="button"
					href="https://github.com/web-scrobbler/web-scrobbler/issues"
					target="_blank"
				>
					{{ L`buttonOpenIssues` }}
				</a>
			</div>
		</template>
	</base-popup>
</template>

<script>
import BasePopup from '@/ui/popups/base-popup.vue';
import SpriteIcon from '@/ui/shared/sprite-icon.vue';

import musicNoteList from 'bootstrap-icons/icons/music-note-list.svg';

export default {
	data() {
		return {
			musicNoteList,

			isDescriptionVisible: false,
		};
	},
	components: { BasePopup, SpriteIcon },
	methods: {
		showDescription() {
			this.isDescriptionVisible = true;
		},
	},
};
</script>
