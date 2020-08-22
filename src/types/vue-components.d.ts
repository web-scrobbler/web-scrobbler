declare module '*.vue' {
	import { defineComponent } from 'vue';
	type Component = ReturnType<typeof defineComponent>;

	const component: Component;
	export default component;
}
