<template>
	<base-modal
		@on-modal-close="forwardEvent('on-modal-close', $event)"
		@on-modal-ok-click="saveProperties"
	>
		<template v-slot:header>{{
			L`accountsScrobblerPropsTitle ${label}`
		}}</template>
		<template v-slot:body>
			<div
				class="mb-3"
				v-for="(property, index) in properties"
				:key="property.titleId"
			>
				<label class="form-label">{{ L(property.titleId) }}</label>
				<input
					class="form-control"
					v-model.trim="editedProperties[index]"
					:type="property.type"
					:placeholder="L(property.placeholderId)"
				/>
			</div>
		</template>
	</base-modal>
</template>

<script>
import BaseModal from '@/ui/options/modals/base-modal.vue';

export default {
	data() {
		return {
			editedProperties: this.createDataFromProperties(),
		};
	},
	components: { BaseModal },
	props: {
		label: String,
		properties: Array,
	},
	methods: {
		forwardEvent(name, data) {
			this.$emit(name, data);
		},

		createDataFromProperties() {
			return this.properties.map((property) => property.value);
		},

		saveProperties() {
			const propertiesToSave = {};

			for (let i = 0; i < this.properties.length; ++i) {
				const { name } = this.properties[i];
				const value = this.editedProperties[i];

				propertiesToSave[name] = value;
			}

			this.$emit('on-save-properties', propertiesToSave);
		},
	},
};
</script>
