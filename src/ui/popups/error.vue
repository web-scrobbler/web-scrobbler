<template>
	<base-popup>
		<template v-slot:icon>
			<sprite-icon :icon="exclamationCircle" class="popup-icon" />
		</template>
		<template v-slot:title>{{ L('serviceErrorHeader') }}</template>
		<template v-slot:body>
			<p class="description">{{ L('serviceErrorDesc') }}</p>
			<a
				class="btn btn-primary btn-sm"
				role="button"
				href="/ui/options/index.html#accounts"
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

import exclamationCircle from 'bootstrap-icons/icons/exclamation-circle.svg';

export default {
	data() {
		return {
			exclamationCircle,
		};
	},
	components: { BasePopup, SpriteIcon },
};
</script>
