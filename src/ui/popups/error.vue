<template>
	<base-popup>
		<template v-slot:icon>
			<sprite-icon :icon="exclamationCircle" class="popup-icon" />
		</template>
		<template v-slot:title>{{ L`serviceErrorHeader` }}</template>
		<template v-slot:body>
			<p class="description">{{ L`serviceErrorDesc` }}</p>
			<div class="mb-2">
				<a
					class="card-link"
					role="button"
					href="/ui/options/index.html#accounts"
					target="_blank"
				>
					{{ L`buttonOpenOptions` }}
				</a>
			</div>
			<div>
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
