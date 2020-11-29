<template>
	<div class="options-section">
		<h5>{{ L`storageUsageTitle` }}</h5>
		<p>{{ usageLabel }}</p>

		<p v-if="usagePercent > usagePercentThreshold">
			{{ L`storageUsageWarningText` }}
		</p>
	</div>
</template>

<script>
import { computed, onBeforeMount, ref } from 'vue';

import { BrowserStorage } from '@/background/storage/browser-storage';

const usagePercentThreshold = 90;

export default {
	setup() {
		return { ...useStorageSize(), usagePercentThreshold };
	},
};

function getReadableSize(bytes) {
	return Math.ceil(bytes / 1024);
}

function useStorageSize() {
	const storageUsed = ref(0);
	const storageTotal = ref(BrowserStorage.getLocalStorageSize());

	onBeforeMount(async () => {
		storageUsed.value = await BrowserStorage.getLocalStorageUsage();
	});

	const usageLabel = computed(() => {
		const usedInKb = getReadableSize(storageUsed.value);
		const totalInKb = getReadableSize(storageTotal.value);

		return `${usedInKb} / ${totalInKb} KB`;
	});

	const usagePercent = computed(() => {
		return Math.ceil((storageUsed.value / storageTotal.value) * 100);
	});

	return { usageLabel, usagePercent };
}
</script>
