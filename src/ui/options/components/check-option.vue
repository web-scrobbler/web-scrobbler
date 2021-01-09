<template>
	<div class="form-check">
		<label class="form-check-label" :title="L(optionTitleId)">
			<input
				class="form-check-input"
				type="checkbox"
				v-model="optionValue"
			/>
			{{ L(optionLabelId) }}
		</label>
	</div>
</template>

<script>
import { computed } from 'vue';

export default {
	emits: ['update:modelValue'],
	props: ['optionLabelId', 'optionTitleId', 'modelValue'],

	setup(props, { emit }) {
		const optionValue = computed({
			get: () => props.modelValue,
			set: (value) => emit('update:modelValue', value),
		});

		return { optionValue };
	},
};
</script>
