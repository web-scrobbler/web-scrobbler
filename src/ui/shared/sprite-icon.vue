<template>
	<svg
		xmlns="http://www.w3.org/2000/svg"
		fill="currentColor"
		focusable="false"
		role="img"
		:width="width"
		:height="height"
		:viewBox="icon.viewBox"
	>
		<use :xlink:href="iconRef" />
	</svg>
</template>

<script>
export default {
	props: {
		icon: {
			type: Object,
		},
		width: {
			type: [Number, String],
		},
		height: {
			type: [Number, String],
		},
	},
	computed: {
		iconRef() {
			return `#${this.icon.id}`;
		},
	},
};
</script>
