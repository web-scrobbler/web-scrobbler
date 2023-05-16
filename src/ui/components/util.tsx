export function Squircle(props: { id: string }) {
	return (
		<svg width="0" height="0">
			<clipPath id={props.id} clipPathUnits="objectBoundingBox">
				<path d="M 0, 0.5 C 0, 0.03 0.03, 0 0.5, 0 S 1, 0.03 1, 0.5 0.97, 1 0.5, 1 0, 0.97 0, 0.5" />
			</clipPath>
		</svg>
	);
}

export function isIos() {
	return CSS.supports('-webkit-touch-callout', 'none');
}
