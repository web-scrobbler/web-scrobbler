<template>
	<div role="tabpanel" @click.alt="showHiddenOptions()">
		<div class="options-section">
			<h5>{{ L`connectorsSidebarTitle` }}</h5>
			<p>{{ L`connectorsDescription` }}</p>
			<p>{{ L`connectorsEnableDisableHint` }}</p>
			<p>
				<span>{{ L`connectorsCustomPatternsHint` }}</span>
				<a
					target="_blank"
					href="https://github.com/web-scrobbler/web-scrobbler/wiki/Custom-URL-patterns"
				>
					{{ L`learnMoreLabel` }}
				</a>
			</p>
		</div>
		<div class="options-section">
			<div class="input-group mb-2">
				<div class="form-check form-switch no-icon">
					<label class="form-check-label font-weight-bold">
						<input
							class="form-check-input"
							type="checkbox"
							v-model="toggleConnectorsValue"
						/>
						{{ L`connectorsToggleConnectors` }}
					</label>
				</div>
			</div>

			<div
				class="input-group mb-2"
				v-for="connector in connectors"
				:key="connector.id"
			>
				<a href="#" @click.prevent="showModal(connector)">
					<sprite-icon :icon="gearIcon" class="connector-icon" />
				</a>
				<div class="form-check form-switch">
					<label class="form-check-label">
						<input
							class="form-check-input"
							type="checkbox"
							:checked="isConnectorEnabled(connector)"
							@input="
								setConnectorEnabled(
									connector,
									$event.target.checked
								)
							"
						/>
						{{ connector.label }}
					</label>
				</div>
			</div>
		</div>
		<add-patterns-modal
			v-if="isModalActive"
			:connector="editedConnector"
			:patterns="getCustomPatterns(editedConnector)"
			@on-save-patterns="saveCustomPatterns"
			@on-modal-close="hideModal"
		/>
	</div>
</template>

<script>
import { onBeforeMount, ref, toRaw, watch } from 'vue';

import AddPatternsModal from '@/ui/options/modals/add-patterns-modal.vue';
import SpriteIcon from '@/ui/shared/sprite-icon.vue';

import gearIcon from 'bootstrap-icons/icons/gear.svg';

import { getSortedConnectors } from '@/common/util-connector';
import { CustomPatterns } from '@/background/storage/custom-patterns';
import {
	getOption,
	isConnectorEnabled,
	setAllConnectorsEnabled,
	setConnectorEnabled,
	DISABLED_CONNECTORS,
} from '@/background/storage/options';

const connectors = getSortedConnectors();

export default {
	components: { AddPatternsModal, SpriteIcon },
	data() {
		return { connectors, gearIcon };
	},
	methods: {
		isConnectorEnabled,
		setConnectorEnabled,
	},
	setup() {
		return {
			...useToggleConnectors(),
			...useCustomPatternsModal(),
		};
	},
};

function useCustomPatternsModal() {
	const { customPatterns } = useCustomPatterns();

	const editedConnector = ref(null);
	const isModalActive = ref(false);

	function showModal(connector) {
		editedConnector.value = connector;

		isModalActive.value = true;
	}

	function hideModal() {
		isModalActive.value = false;
	}

	function saveCustomPatterns(patterns) {
		const connectorId = editedConnector.value.id;
		if (patterns.length > 0) {
			customPatterns.value[connectorId] = patterns;
		} else {
			delete customPatterns.value[connectorId];
		}
	}

	function getCustomPatterns(connector) {
		return customPatterns.value[connector.id] || [];
	}

	return {
		isModalActive,
		editedConnector,

		hideModal,
		showModal,

		getCustomPatterns,
		saveCustomPatterns,
	};
}

function useCustomPatterns() {
	const customPatterns = ref({});

	onBeforeMount(async () => {
		customPatterns.value = await CustomPatterns.getData();

		watch(
			customPatterns,
			async (newValue) => await CustomPatterns.saveData(toRaw(newValue)),
			{ deep: true }
		);
	});

	return { customPatterns };
}

function useToggleConnectors() {
	const toggleConnectorsValue = ref(getToggleConnectorsState());
	watch(toggleConnectorsValue, (isEnabled) => {
		setAllConnectorsEnabled(isEnabled);
	});

	return {
		toggleConnectorsValue,
	};
}

function getToggleConnectorsState() {
	const disabledConnectors = getOption(DISABLED_CONNECTORS);
	return Object.keys(disabledConnectors).length !== connectors.length;
}
</script>

<style>
.connector-icon {
	height: 1.2rem;
	margin-bottom: 0.2rem;
	margin-right: 0.5rem;
	width: 1.2rem;
}

.no-icon {
	margin-left: 1.65rem;
}
</style>
