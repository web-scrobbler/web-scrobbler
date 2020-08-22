<template>
	<base-popup>
		<template v-slot:icon>
			<sprite-icon :icon="emojiFrown" class="popup-icon" />
		</template>
		<template v-slot:title>{{ L`unsupportedWebsiteHeader` }}</template>
		<template v-slot:body>
			<p class="description">{{ L`unsupportedWebsiteDesc` }}</p>

			<p class="description mb-0">
				<span>{{ L`unsupportedWebsiteDesc2` }}</span>
				<a
					target="_blank"
					href="https://cloud.google.com/docs/chrome-enterprise/policies/?policy=ExtensionSettings"
				>
					{{ L`learnMoreLabel` }}
				</a>
			</p>
		</template>
	</base-popup>
</template>

<script>
import BasePopup from '@/ui/popups/base-popup.vue';
import SpriteIcon from '@/ui/shared/sprite-icon.vue';

import emojiFrown from 'bootstrap-icons/icons/emoji-frown.svg';

export default {
	data() {
		return {
			emojiFrown,
		};
	},
	components: { BasePopup, SpriteIcon },
};
</script>
