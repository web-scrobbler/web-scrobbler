<template>
	<base-modal
		@onClose="forwardEvent('onClose', $event)"
		@onOkClick="saveProperties"
	>
		<template v-slot:header>{{
			L('accountsScrobblerPropsTitle', label)
		}}</template>
		<template v-slot:body>
			<div class="mb-3" v-for="(property, index) in properties">
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
			const data = [];

			for (const property of this.properties) {
				data.push(property.value);
			}

			return data;
		},

		saveProperties() {
			const propertiesToSave = {};

			for (let i = 0; i < this.properties.length; ++i) {
				const { name } = this.properties[i];
				const value = this.editedProperties[i];

				propertiesToSave[name] = value;
			}

			this.forwardEvent('onOkClick', propertiesToSave);
		},
	},
};
</script>
