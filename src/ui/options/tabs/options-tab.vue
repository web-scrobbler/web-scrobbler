<template>
	<div role="tabpanel" @click.alt="showHiddenOptions()">
		<div class="options-section">
			<h5>{{ L`optionsGeneral` }}</h5>

			<check-option
				option-label-id="optionUseNotifications"
				option-title-id="optionUseNotificationsTitle"
				v-model="useNotifications"
			/>

			<check-option
				option-label-id="optionUnrecognizedNotifications"
				option-title-id="optionUnrecognizedNotificationsTitle"
				v-model="useUnrecognizedSongNotifications"
			/>

			<check-option
				option-label-id="optionForceRecognize"
				option-title-id="optionForceRecognizeTitle"
				v-model="forceRecognize"
			/>

			<check-option
				option-label-id="optionScrobblePodcasts"
				option-title-id="optionScrobblePodcastsTitle"
				v-model="scrobblePodcasts"
			/>
		</div>

		<div class="options-section">
			<h5>Tidal</h5>

			<check-option
				option-label-id="optionTdlShortTrackNames"
				option-title-id="optionTdlShortTrackNamesTitle"
				v-model="tidal_useShortTrackNames"
			/>
		</div>

		<div class="options-section">
			<h5>YouTube</h5>

			<check-option
				option-label-id="optionYtMusicOnly"
				option-title-id="optionYtMusicOnlyTitle"
				v-model="youtube_scrobbleMusicOnly"
			/>

			<check-option
				option-label-id="optionYtEntertainmentOnly"
				option-title-id="optionYtEntertainmentOnlyTitle"
				v-model="youtube_scrobbleEntertainmentOnly"
			/>

			<p class="mt-2">
				<small class="text-muted">{{ L`optionYtDesc` }}</small>
			</p>
		</div>

		<div v-if="areHiddenOptionVisible" class="options-section">
			<h5>{{ L`optionsHidden` }}</h5>
			<div class="form-group">
				<label>{{ L`optionScrobblePercent` }}</label>
				<select
					class="form-select form-select-sm percent-select"
					v-model.number="scrobblePercent"
				>
					<option v-for="percent in percentValues" :key="percent">
						{{ percent }}
					</option>
				</select>
				<label>% {{ L`optionScrobblePercentSuffix` }}</label>
			</div>
			<p class="mt-2">
				<small class="text-muted">{{ L`optionPercentDesc` }}</small>
			</p>
		</div>
	</div>
</template>

<script>
import { ref, watch } from 'vue';

import { getOptions } from '@/background/repository/GetOptions';
import { getConnectorsOptions } from '@/background/repository/GetConnectorsOptions';

import CheckOption from '@/ui/options/components/check-option.vue';

const options = getOptions();
const connectorOptions = getConnectorsOptions();

export default {
	components: { CheckOption },
	setup() {
		const percentValues = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

		return {
			...useHiddenOptions(),
			...useExtensionOptions(),
			...useConnectorsOptions(),
			percentValues,
		};
	},
};

/**
 * Return an object with refs for the extension options.
 *
 * Each ref can be used in the `v-model` attribute, e.g.:
 * <component v-model="optionKey" ... />
 *
 * @return {Record<string, WritableComputedRef<any>>} Object containing refs
 */
function useExtensionOptions() {
	const options = {};
	const optionKeys = [
		'useNotifications',
		'useUnrecognizedSongNotifications',
		'forceRecognize',
		'scrobblePodcasts',
		'scrobblePercent',
	];

	for (const optionKey of optionKeys) {
		options[optionKey] = createExtensionOptionRef(optionKey);
	}

	return options;
}

/**
 * Return an object with refs for connectors options.
 *
 * Each ref can be used in the `v-model` attribute, e.g.:
 * <component v-model="connectorId_optionKey" ... />
 *
 * @return {Record<string, Ref<any>>} Object containing refs
 */
function useConnectorsOptions() {
	const options = {};
	const connectorOptionKeys = {
		youtube: ['scrobbleMusicOnly', 'scrobbleEntertainmentOnly'],
		tidal: ['useShortTrackNames'],
	};

	for (const connectorId in connectorOptionKeys) {
		const optionKeys = connectorOptionKeys[connectorId];

		for (const optionKey of optionKeys) {
			options[`${connectorId}_${optionKey}`] = createConnectorOptionRef(
				connectorId,
				optionKey
			);
		}
	}

	return options;
}

/**
 * Create a Vue ref for the given option.
 *
 * This ref will be initialized with the option value asynchronously. Updating
 * ref's value will also save the option value.
 *
 * This ref is supposed to be used as a `v-model` attribute value.
 *
 * @param {String} optionKey Option key
 *
 * @return {Ref<any>} Ref
 */
function createExtensionOptionRef(optionKey) {
	const optionRef = ref(null);
	watch(optionRef, (value) => {
		options.setOption(optionKey, value);
	});

	options.getOption(optionKey).then((value) => {
		optionRef.value = value;
	});

	return optionRef;
}

/**
 * Create a Vue computed ref for the given option for a connector with the given
 * connector ID.
 *
 * This ref will be initialized with the option value asynchronously. Updating
 * ref's value will also save the option value.
 *
 * This ref is supposed to be used as a `v-model`.
 *
 * @param {String} connectorId Connector ID
 * @param {String} optionKey Option key
 *
 * @return {Ref<any>} Ref
 */
function createConnectorOptionRef(connectorId, optionKey) {
	const optionRef = ref(null);
	watch(optionRef, (value) => {
		connectorOptions.setOption(connectorId, optionKey, value);
	});

	connectorOptions.getOption(connectorId, optionKey).then((value) => {
		optionRef.value = value;
	});

	return optionRef;
}

function useHiddenOptions() {
	const areHiddenOptionVisible = ref(false);

	function showHiddenOptions() {
		areHiddenOptionVisible.value = true;
	}

	return { areHiddenOptionVisible, showHiddenOptions };
}
</script>

<style>
.percent-select {
	display: inline;
	margin-left: 0.5rem;
	margin-right: 0.5rem;
	width: auto;
}
</style>
