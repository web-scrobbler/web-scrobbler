<template>
	<base-popup>
		<template v-slot:icon>
			<sprite-icon :icon="toggleOffIcon" class="popup-icon" />
		</template>
		<template v-slot:title>{{ L('disabledSiteHeader') }}</template>
		<template v-slot:body>
			<p class="description">{{ L('disabledSiteDesc') }}</p>
			<a
				class="card-link"
				role="button"
				href="/ui/options/index.html#connectors"
				target="_blank"
			>
				{{ L('buttonOpenOptions') }}
			</a>
		</template>
	</base-popup>
</template>

<script>
import BasePopup from '@/ui/popups/base-popup.vue';
import SpriteIcon from '@/ui/shared/sprite-icon.vue';

import toggleOffIcon from 'bootstrap-icons/icons/toggle-off.svg';

export default {
	data() {
		return {
			toggleOffIcon,
		};
	},
	components: { BasePopup, SpriteIcon },
};
</script>
