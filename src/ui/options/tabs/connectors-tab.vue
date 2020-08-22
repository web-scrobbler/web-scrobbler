<template>
	<div role="tabpanel" @click.alt="showHiddenOptions()">
		<div class="options-section">
			<h5>{{ L('connectorsSidebarTitle') }}</h5>
			<p>{{ L('connectorsDescription') }}</p>
			<p>{{ L('connectorsEnableDisableHint') }}</p>
			<p>
				<span>{{ L('connectorsCustomPatternsHint') }}</span>
				<a
					target="_blank"
					href="https://github.com/web-scrobbler/web-scrobbler/wiki/Custom-URL-patterns"
				>
					{{ L('learnMoreLabel') }}
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
						{{ L('connectorsToggleConnectors') }}
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
			@onOkClick="updateCustomPatterns"
			@onClose="hideModal"
		/>
	</div>
</template>

<script>
import AddPatternsModal from '@/ui/options/modals/add-patterns-modal.vue';
import SpriteIcon from '@/ui/shared/sprite-icon.vue';

import { getSortedConnectors } from '@/common/util-connector';
import { CustomPatterns } from '@/background/storage/custom-patterns';
import {
	getOption,
	isConnectorEnabled,
	setAllConnectorsEnabled,
	setConnectorEnabled,
	DISABLED_CONNECTORS,
} from '@/background/storage/options';

import gearIcon from 'bootstrap-icons/icons/gear.svg';

const connectors = getSortedConnectors();

function getToggleConnectorsState() {
	const disabledConnectors = getOption(DISABLED_CONNECTORS);
	return Object.keys(disabledConnectors).length !== connectors.length;
}

export default {
	created() {
		this.loadCustomPatterns();
	},
	data() {
		return {
			connectors,

			gearIcon,

			toggleConnectorsValue: getToggleConnectorsState(),

			isModalActive: false,
			editedConnector: {},
		};
	},
	components: { AddPatternsModal, SpriteIcon },
	watch: {
		toggleConnectorsValue(newValue) {
			const isEnabled = newValue;

			setAllConnectorsEnabled(isEnabled);
		},
	},
	methods: {
		isConnectorEnabled,
		setConnectorEnabled,

		async loadCustomPatterns() {
			this.customPatterns = await CustomPatterns.getData();
		},

		async updateCustomPatterns(patterns) {
			const connectorId = this.editedConnector.id;
			if (patterns.length > 0) {
				this.customPatterns[connectorId] = patterns;
			} else {
				delete this.customPatterns[connectorId];
			}
			await CustomPatterns.saveData(this.customPatterns);

			this.hideModal();
		},

		getCustomPatterns(connector) {
			return this.customPatterns[connector.id] || [];
		},

		showModal(connector) {
			this.editedConnector = connector;

			this.isModalActive = true;
		},

		hideModal() {
			this.isModalActive = false;
		},
	},
};
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
