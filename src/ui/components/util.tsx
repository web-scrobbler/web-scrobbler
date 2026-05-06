import type { JSXElement } from 'solid-js';
import { For, Show, createMemo } from 'solid-js';
import { t } from '../../util/i18n';
import browser from 'webextension-polyfill';

/**
 * Returns a squircle svg element with the given id.
 */
export function Squircle(props: { id: string }) {
	return (
		<svg width="0" height="0">
			<clipPath id={props.id} clipPathUnits="objectBoundingBox">
				<path d="M 0, 0.5 C 0, 0.03 0.03, 0 0.5, 0 S 1, 0.03 1, 0.5 0.97, 1 0.5, 1 0, 0.97 0, 0.5" />
			</clipPath>
		</svg>
	);
}

/**
 * @returns true if the user is on an iOS device, false otherwise.
 */
export function isIos() {
	return CSS.supports('-webkit-touch-callout', 'none');
}

/**
 * Vivaldi crashes when clicking target _blank urls from a popup.
 * This allows us to open urls in a new tab from a popup without crashes.
 *
 * @param url - The url to open in a new tab.
 */
async function openInNewTabFromPopup(url: string) {
	try {
		const tab = await browser.tabs.query({ active: true });
		browser.tabs.create({ url, index: tab[0].index + 1 });
	} catch {
		browser.tabs.create({ url });
	}
}

/**
 * Vivaldi crashes when clicking target _blank urls from a popup.
 * Returns an anchor JSX component that opens the url in a new tab from a popup without crashing.
 */
export function PopupAnchor(props: {
	children: JSXElement | string;
	href: string;
	class?: string;
	title?: string;
}) {
	return (
		<a
			href={props.href}
			title={props.title}
			aria-label={props.title}
			class={props.class}
			onClick={(e) => {
				e.preventDefault();
				void openInNewTabFromPopup(props.href);
			}}
		>
			{props.children}
		</a>
	);
}

export function Anchor(props: {
	children: JSXElement | string;
	href: string;
	class?: string;
	title?: string;
	target?: '_blank' | '_top' | '_self' | '_parent';
}) {
	return (
		<a
			href={props.href}
			title={props.title}
			aria-label={props.title}
			class={props.class}
			target={props.target}
		>
			{props.children}
		</a>
	);
}

/**
 * Regex that finds anchor tag
 */
const anchorRegex = /<a.*?href=("|')((?:(?!\1).)+)\1.*?>([^<]+)<\/a>/g;
type Localization = {
	messageName: string;
	substitutions?: string | string[];
};
const anchorTuples = (props: Localization) => {
	const message = t(props.messageName, props.substitutions);
	const matches = message.matchAll(anchorRegex);
	const segments = [];
	let previousMatchEnd = 0;
	for (const match of matches) {
		// prettier-ignore
		const [str, /* delimiter */, href, content] = match;
		segments.push(message.slice(previousMatchEnd, match.index));
		segments.push([href, content]);
		previousMatchEnd = match.index + str.length;
	}
	segments.push(message.slice(previousMatchEnd));

	return segments;
};

/**
 * Gets localized string from locale and turns anchors into popup anchors.
 * Has a maximum iterations count just for safety's sake because while loop with janky code moment.
 */
export function TPopupAnchor(props: Localization): JSXElement {
	const anchorMemo = createMemo(() => anchorTuples(props));
	// convert the array of strings and tuples into a JSX element
	return (
		<For each={anchorMemo()}>
			{(item) => (
				<Show when={typeof item !== 'string'} fallback={item}>
					<PopupAnchor href={item[0]}>{item[1]}</PopupAnchor>
				</Show>
			)}
		</For>
	);
}

export function TAnchor(
	props: Localization & {
		class?: string;
		target?: '_blank' | '_top' | '_self' | '_parent';
	},
): JSXElement {
	const anchorMemo = createMemo(() => anchorTuples(props));
	return (
		<For each={anchorMemo()}>
			{(item) => (
				<Show when={typeof item !== 'string'} fallback={item}>
					<Anchor
						href={item[0]}
						class={props.class}
						target={props.target}
					>
						{item[1]}
					</Anchor>
				</Show>
			)}
		</For>
	);
}
