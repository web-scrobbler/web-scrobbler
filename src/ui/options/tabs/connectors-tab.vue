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
						<input class="form-check-input" type="checkbox" />
						{{ connector.label }}
					</label>
				</div>
			</div>
		</div>
		<add-patterns-modal
			v-if="isModalActive"
			:connector="editedConnector"
			:patterns="customPatterns"
			@on-save-patterns="setCustomPatterns"
			@on-modal-close="hideModal"
		/>
	</div>
</template>

<script>
import { ref, toRaw, watch } from 'vue';

import AddPatternsModal from '@/ui/options/modals/add-patterns-modal.vue';
import SpriteIcon from '@/ui/shared/sprite-icon.vue';

import gearIcon from 'bootstrap-icons/icons/gear.svg';

import { getSortedConnectors } from '@/common/util-connector';
import { getOptions } from '@/background/repository/GetOptions';
import { getCustomUrlPatterns } from '@/background/repository/GetCustomUrlPatterns';

const connectors = getSortedConnectors();

const options = getOptions();
const customUrlPatterns = getCustomUrlPatterns();

export default {
	components: { AddPatternsModal, SpriteIcon },
	data() {
		return { connectors, gearIcon };
	},
	setup() {
		return {
			...useToggleConnectors(),
			...useCustomPatternsModal(),
		};
	},
};

function useCustomPatternsModal() {
	const { customPatterns, setCustomPatterns } = useCustomPatterns();

	const isModalActive = ref(false);
	const editedConnector = ref(null);

	async function showModal(connector) {
		customPatterns.value = await customUrlPatterns.getPatterns(
			connector.id
		);
		editedConnector.value = connector;
		isModalActive.value = true;
	}

	function hideModal() {
		isModalActive.value = false;
	}

	return {
		isModalActive,
		hideModal,
		showModal,

		editedConnector,
		customPatterns,
		setCustomPatterns,
	};
}

function useCustomPatterns() {
	const customPatterns = ref([]);

	function setCustomPatterns(connector, patterns) {
		customUrlPatterns.setPatterns(connector.id, toRaw(patterns));
	}

	return { customPatterns, setCustomPatterns };
}

function useToggleConnectors() {
	const toggleConnectorsValue = ref(getToggleConnectorsState());
	const allConnectorIds = connectors.map((connector) => connector.id);

	watch(toggleConnectorsValue, (isEnabled) => {
		options.setConnectorsEnabled(allConnectorIds, isEnabled);
	});

	return {
		toggleConnectorsValue,
	};
}

function getToggleConnectorsState() {
	// const disabledConnectors = getOption(DISABLED_CONNECTORS);
	// return Object.keys(disabledConnectors).length !== connectors.length;
	return false;
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
