<template>
	<div role="tabpanel" @click.alt="showHiddenOptions()">
		<div class="options-section">
			<h5>{{ L`optionsGeneral` }}</h5>
			<div class="form-check">
				<label
					class="form-check-label"
					:title="L`optionUseNotificationsTitle`"
				>
					<input
						class="form-check-input"
						type="checkbox"
						v-model="USE_NOTIFICATIONS"
					/>
					{{ L`optionUseNotifications` }}
				</label>
			</div>
			<div class="form-check">
				<label
					class="form-check-label"
					:title="L`optionUnrecognizedNotificationsTitle`"
				>
					<input
						class="form-check-input"
						type="checkbox"
						v-model="USE_UNRECOGNIZED_SONG_NOTIFICATIONS"
					/>
					{{ L`optionUnrecognizedNotifications` }}
				</label>
			</div>
			<div class="form-check">
				<label
					class="form-check-label"
					:title="L`optionForceRecognizeTitle`"
				>
					<input
						class="form-check-input"
						type="checkbox"
						v-model="FORCE_RECOGNIZE"
					/>
					{{ L`optionForceRecognize` }}
				</label>
			</div>
			<div class="form-check">
				<label
					class="form-check-label"
					:title="L`optionScrobblePodcastsTitle`"
				>
					<input
						class="form-check-input"
						type="checkbox"
						v-model="SCROBBLE_PODCASTS"
					/>
					{{ L`optionScrobblePodcasts` }}
				</label>
			</div>
		</div>

		<div class="options-section">
			<h5>Tidal</h5>
			<div class="form-check">
				<label
					class="form-check-label"
					:title="L`optionTdlShortTrackNamesTitle`"
				>
					<input
						class="form-check-input"
						type="checkbox"
						v-model="Tidal_useShortTrackNames"
					/>
					{{ L`optionTdlShortTrackNames` }}
				</label>
			</div>
		</div>

		<div class="options-section">
			<h5>YouTube</h5>
			<div class="form-check">
				<label
					class="form-check-label"
					:title="L`optionYtMusicOnlyTitle`"
				>
					<input
						class="form-check-input"
						type="checkbox"
						v-model="YouTube_scrobbleMusicOnly"
					/>
					{{ L`optionYtMusicOnly` }}
				</label>
			</div>
			<div class="form-check">
				<label
					class="form-check-label"
					:title="L`optionYtEntertainmentOnlyTitle`"
				>
					<input
						class="form-check-input"
						type="checkbox"
						v-model="YouTube_scrobbleEntertainmentOnly"
					/>
					{{ L`optionYtEntertainmentOnly` }}
				</label>
			</div>

			<p class="mt-2">
				<small class="text-muted">{{ L`optionYtDesc` }}</small>
			</p>
		</div>

		<div class="options-section" v-if="areHiddenOptionVisible">
			<h5>{{ L`optionsHidden` }}</h5>
			<div class="form-group">
				<label>{{ L`optionScrobblePercent` }}</label>
				<select
					class="form-select form-select-sm percent-select"
					v-model="SCROBBLE_PERCENT"
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
import {
	getConnectorOption,
	getConnectorOptions,
	getConnectorsList,
	getOption,
	setConnectorOption,
	setOption,
	FORCE_RECOGNIZE,
	SCROBBLE_PERCENT,
	SCROBBLE_PODCASTS,
	USE_NOTIFICATIONS,
	USE_UNRECOGNIZED_SONG_NOTIFICATIONS,
} from '@/background/storage/options';

function makeComputedProperties() {
	const properties = {};
	const optionsList = {
		FORCE_RECOGNIZE,
		SCROBBLE_PERCENT,
		SCROBBLE_PODCASTS,
		USE_NOTIFICATIONS,
		USE_UNRECOGNIZED_SONG_NOTIFICATIONS,
	};

	for (const propertyName in optionsList) {
		const optionName = optionsList[propertyName];

		properties[propertyName] = {
			get() {
				return getOption(optionName);
			},
			set(value) {
				setOption(optionName, value);
			},
		};
	}

	for (const connectorLabel of getConnectorsList()) {
		const connectorOptions = getConnectorOptions(connectorLabel);

		for (const optionName of connectorOptions) {
			const propertyName = `${connectorLabel}_${optionName}`;

			properties[propertyName] = {
				get() {
					return getConnectorOption(connectorLabel, optionName);
				},
				set(value) {
					setConnectorOption(connectorLabel, optionName, value);
				},
			};
		}
	}

	return properties;
}

export default {
	data() {
		return {
			areHiddenOptionVisible: false,
			percentValues: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
		};
	},
	computed: makeComputedProperties(),
	methods: {
		showHiddenOptions() {
			this.areHiddenOptionVisible = true;
		},
	},
};
</script>

<style>
.percent-select {
	display: inline;
	margin-left: 0.5rem;
	margin-right: 0.5rem;
	width: auto;
}
</style>
