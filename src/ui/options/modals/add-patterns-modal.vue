<template>
	<base-modal
		@onClose="forwardEvent('onClose', $event)"
		@onOkClick="savePatterns"
	>
		<template v-slot:header> {{ connector.label }} </template>
		<template v-slot:body>
			<div class="options-section" v-if="hasBuiltinPatterns()">
				<h6>{{ L('patternsBuiltinPatterns') }}</h6>
				<ul class="list-unstyled">
					<li v-for="(pattern, index) in getBuiltinPatterns()" :key="index">
						<span class="pattern">{{ pattern }}</span>
					</li>
				</ul>
			</div>
			<div class="options-section" v-if="hasCustomPatterns()">
				<h6>{{ L('patternsCustomPatterns') }}</h6>
				<ul class="list-unstyled">
					<li v-for="(pattern, index) in editedPatterns" :key="index">
						<span class="pattern">{{ pattern }}</span>
						<button
							type="button"
							class="close"
							:title="L('buttonRemove')"
							@click="removePattern(index)"
						>
							<span aria-hidden="true">&times;</span>
						</button>
					</li>
				</ul>
			</div>

			<p>{{ L('patternsCustomPatternsHint') }}</p>
			<div class="input-group mb-3">
				<input
					class="form-control"
					type="text"
					spellcheck="false"
					:placeholder="L('patternsCustomPatternPlaceholder')"
					v-model.trim="editedPattern"
				/>
				<button
					class="btn btn-outline-secondary"
					type="button"
					@click="addPattern"
				>
					{{ L('buttonAdd') }}
				</button>
			</div>
		</template>
	</base-modal>
</template>

<script>
import BaseModal from '@/ui/options/modals/base-modal.vue';

export default {
	data() {
		return {
			editedPattern: null,
			editedPatterns: [],
		};
	},
	created() {
		this.editedPatterns = [...this.patterns];
	},
	components: { BaseModal },
	props: ['connector', 'patterns'],
	methods: {
		addPattern() {
			if (this.editedPattern) {
				this.editedPatterns.push(this.editedPattern);

				this.editedPattern = null;
			}
		},

		getBuiltinPatterns() {
			return this.connector.matches;
		},

		hasBuiltinPatterns() {
			return this.connector.matches && this.connector.matches.length > 0;
		},

		hasCustomPatterns() {
			return this.editedPatterns.length > 0;
		},

		savePatterns() {
			this.forwardEvent('onOkClick', this.editedPatterns);
		},

		removePattern(index) {
			this.editedPatterns.splice(index, 1);
		},

		forwardEvent(name, data) {
			this.$emit(name, data);
		},
	},
};
</script>

<style>
.pattern {
	font-family: monospace;
	overflow: ellipsis;
	word-wrap: break-word;
}
</style>
