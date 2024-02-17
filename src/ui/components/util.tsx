import { For, JSXElement, Show, createSignal, onMount } from 'solid-js';
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

/**
 * Regex that finds anchor tag
 */
const anchorRegex = /<a.*?href="([^"]+)".*?>([^<]+)<\/a>/;

/**
 * Gets localized string from locale and turns anchors into popup anchors.
 * Has a maximum iterations count just for safety's sake because while loop with janky code moment.
 */
export function TPopupAnchor(props: {
	messageName: string;
	substitutions?: string | string[];
}): JSXElement {
	const [res, setRes] = createSignal<(string | [string, string])[]>([]);
	onMount(() => {
		let message = t(props.messageName, props.substitutions);
		const maxIterations = 5;
		let i = 0;
		while (message) {
			// check if we've gone over the max iterations
			i++;
			if (i > maxIterations) {
				break;
			}

			// get match and break if there is none, inserting remaining message
			const match = message.match(anchorRegex);
			if (!match) {
				// eslint-disable-next-line
				setRes((prev) => [...prev, message]);
				break;
			}

			// get full string, href from capture group 1, and tag content from capture group 2
			const [str, href, content] = match;

			// push the content before the anchor, the anchor, and then slice the message to repeat the loop on remaining text.
			// eslint-disable-next-line
			setRes((prev) => [
				...prev,
				message.slice(0, match.index),
				[href, content],
			]);
			message = message.slice((match.index ?? 0) + str.length);
		}
	});
	// convert the array of strings and tuples into a JSX element
	return (
		<For each={res()}>
			{(item) => (
				<Show when={typeof item !== 'string'} fallback={item}>
					<PopupAnchor href={item[0]}>{item[1]}</PopupAnchor>
				</Show>
			)}
		</For>
	);
}
