import styles from '../ui/popup/popup.module.scss';

export const LastFMIcon = () => (
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
		<path d="M225.8 367.1l-18.8-51s-30.5 34-76.2 34c-40.5 0-69.2-35.2-69.2-91.5 0-72.1 36.4-97.9 72.1-97.9 66.5 0 74.8 53.3 100.9 134.9 18.8 56.9 54 102.6 155.4 102.6 72.7 0 122-22.3 122-80.9 0-72.9-62.7-80.6-115-92.1-25.8-5.9-33.4-16.4-33.4-34 0-19.9 15.8-31.7 41.6-31.7 28.2 0 43.4 10.6 45.7 35.8l58.6-7c-4.7-52.8-41.1-74.5-100.9-74.5-52.8 0-104.4 19.9-104.4 83.9 0 39.9 19.4 65.1 68 76.8 44.9 10.6 79.8 13.8 79.8 45.7 0 21.7-21.1 30.5-61 30.5-59.2 0-83.9-31.1-97.9-73.9-32-96.8-43.6-163-161.3-163C45.7 113.8 0 168.3 0 261c0 89.1 45.7 137.2 127.9 137.2 66.2 0 97.9-31.1 97.9-31.1z" />
	</svg>
);

export const AlbumOff = () => (
	<svg
		aria-hidden="true"
		viewBox="0 0 24 24"
		data-testid="AlbumIcon"
		version="1.1"
		id="svg134"
		width="24"
		height="24"
		xmlns="http://www.w3.org/2000/svg"
	>
		<defs id="defs138">
			<mask
				maskUnits="userSpaceOnUse"
				id="mask-powermask-path-effect3728"
			>
				<path
					id="mask-powermask-path-effect3728_box"
					style={{ fill: '#ffffff', 'fill-opacity': '1' }}
					d="M 1,1 H 23 V 23 H 1 Z"
				/>
				<g id="g3726">
					<rect
						class={styles.applyFill}
						style={{
							'fill-opacity': '1',
							stroke: 'none',
						}}
						id="rect3722"
						width="27.407948"
						height="1.5774385"
						x="-12.412281"
						y="-0.70559257"
						ry="0"
						transform="rotate(41.317859)"
					/>
					<rect
						class={styles.applyFill}
						style={{
							'fill-opacity': '1',
							stroke: 'none',
						}}
						id="rect3724"
						width="27.407948"
						height="1.5774385"
						x="18.354237"
						y="-0.67120558"
						ry="0"
						transform="rotate(41.317859)"
					/>
				</g>
			</mask>
		</defs>
		<path
			d="M 12,2 C 6.48,2 2,6.48 2,12 2,17.52 6.48,22 12,22 17.52,22 22,17.52 22,12 22,6.48 17.52,2 12,2 Z m 0,14.5 C 9.51,16.5 7.5,14.49 7.5,12 7.5,9.51 9.51,7.5 12,7.5 c 2.49,0 4.5,2.01 4.5,4.5 0,2.49 -2.01,4.5 -4.5,4.5 z M 12,11 c -0.55,0 -1,0.45 -1,1 0,0.55 0.45,1 1,1 0.55,0 1,-0.45 1,-1 0,-0.55 -0.45,-1 -1,-1 z"
			id="path132"
			class={styles.applyFill}
			style={{ display: 'inline' }}
			mask="url(#mask-powermask-path-effect3728)"
		/>
		<rect
			class={styles.applyFill}
			style={{
				'fill-opacity': '1',
				stroke: 'none',
			}}
			id="rect413"
			width="27.407948"
			height="1.5774385"
			x="3.194612"
			y="0.87523758"
			ry="0"
			transform="rotate(41.317859)"
		/>
	</svg>
);
