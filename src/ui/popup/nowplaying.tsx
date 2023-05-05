import { t } from '@/util/i18n';
import styles from './popup.module.scss';
import {
	Accessor,
	JSXElement,
	Match,
	Resource,
	Setter,
	Show,
	Switch,
	createEffect,
	createMemo,
	createSignal,
	onCleanup,
	onMount,
} from 'solid-js';
import { ManagerTab } from '@/core/storage/wrapper';
import browser from 'webextension-polyfill';
import ClonedSong from '@/core/object/cloned-song';
import Base from './base';
import { LastFMIcon } from '@/util/icons';
import Edit from '@suid/icons-material/EditOutlined';
import Block from '@suid/icons-material/BlockOutlined';
import Favorite from '@suid/icons-material/FavoriteOutlined';
import HeartBroken from '@suid/icons-material/HeartBrokenOutlined';
import RestartAlt from '@suid/icons-material/RestartAltOutlined';
import { sendBackgroundMessage } from '@/util/communication';
import * as ControllerMode from '@/core/object/controller/controller-mode';
import EditComponent from './edit';
import {
	createAlbumURL,
	createArtistURL,
	createTrackLibraryURL,
} from '@/util/util';
import scrobbleService from '@/core/object/scrobble-service';
import { SessionData } from '@/core/scrobbler/base-scrobbler';

/**
 * Component showing info for currently playing song if there is one
 */
export default function NowPlaying(props: { tab: Resource<ManagerTab> }) {
	const { tab } = props;

	const [isEditing, setIsEditing] = createSignal(false);

	const song = createMemo(() => {
		const rawTab = tab();
		if (!rawTab) return null;
		const rawSong = rawTab.song;
		if (!rawSong) return null;
		return new ClonedSong(rawSong, rawTab.tabId);
	});

	// set width property manually, safari doesnt play well with dynamic
	let nowplaying: HTMLDivElement | undefined;
	function resizeWindow() {
		if (!nowplaying || nowplaying.scrollWidth < 10) {
			return;
		}
		document.body.style.width = `${nowplaying.scrollWidth}px`;
	}
	const observer = new ResizeObserver(resizeWindow);

	onMount(() => {
		if (!nowplaying) {
			return;
		}
		observer.observe(nowplaying);
	});

	onCleanup(() => {
		observer.disconnect();
		document.body.style.width = 'auto';
	});

	createEffect(() => {
		if (isEditing()) {
			observer.disconnect();
		} else {
			if (!nowplaying) {
				return;
			}
			observer.disconnect();
			observer.observe(nowplaying);

			if (nowplaying.scrollWidth > 10) {
				document.body.style.width = `${nowplaying.scrollWidth}px`;
			}
		}
	});

	return (
		<Switch fallback={<Base />}>
			<Match when={isEditing()}>
				<EditComponent tab={tab} />
			</Match>
			<Match when={song()}>
				<div class={styles.nowPlayingPopup} ref={nowplaying}>
					<PopupLink
						class={styles.coverArtWrapper}
						href={
							song()?.getTrackArt() ??
							browser.runtime.getURL('img/cover_art_default.png')
						}
						title={t('infoOpenAlbumArt')}
					>
						<img
							class={styles.coverArt}
							src={
								song()?.getTrackArt() ??
								browser.runtime.getURL(
									'img/cover_art_default.png'
								)
							}
						/>
					</PopupLink>
					<SongDetails
						song={song}
						tab={tab}
						setIsEditing={setIsEditing}
					/>
				</div>
			</Match>
		</Switch>
	);
}

function SongDetails(props: {
	song: Accessor<ClonedSong | null>;
	tab: Resource<ManagerTab>;
	setIsEditing: Setter<boolean>;
}) {
	const { song, tab } = props;
	return (
		<div class={styles.songDetails}>
			<TrackData song={song} />
			<TrackMetadata song={song} />
			<TrackControls
				song={song}
				tab={tab}
				setIsEditing={props.setIsEditing}
			/>
		</div>
	);
}

/**
 * The component showing the track data.
 */
function TrackData(props: { song: Accessor<ClonedSong | null> }) {
	const { song } = props;
	return (
		<>
			<PopupLink
				class={styles.bold}
				href={song()?.metadata?.trackUrl ?? ''}
				title={t('infoViewTrackPage', song()?.getTrack() ?? '')}
			>
				{song()?.getTrack()}
			</PopupLink>
			<PopupLink
				href={song()?.metadata?.artistUrl ?? ''}
				title={t('infoViewArtistPage', song()?.getArtist() ?? '')}
			>
				{song()?.getArtist()}
			</PopupLink>
			<PopupLink
				href={createAlbumURL(
					song()?.getAlbumArtist() || song()?.getArtist(),
					song()?.getTrack()
				)}
				title={t('infoViewAlbumPage', song()?.getAlbum() ?? '')}
			>
				{song()?.getAlbum()}
			</PopupLink>
			<PopupLink
				href={createArtistURL(song()?.getAlbumArtist())}
				title={t('infoViewArtistPage', song()?.getAlbumArtist() ?? '')}
			>
				{song()?.getAlbumArtist()}
			</PopupLink>
		</>
	);
}

/**
 * The component showing the number of times scrobbled and the connector.
 */
function TrackMetadata(props: { song: Accessor<ClonedSong | null> }) {
	const { song } = props;

	const [session, setSession] = createSignal<SessionData>();
	scrobbleService
		.getScrobblerByLabel('Last.fm')
		?.getSession()
		.then(setSession);

	return (
		<div class={styles.playDetails}>
			<PopupLink
				class={`${styles.playCount} ${styles.label}`}
				href={createTrackLibraryURL(
					session()?.sessionName,
					song()?.getArtist(),
					song()?.getTrack()
				)}
				title={t(
					'infoYourScrobbles',
					(song()?.metadata.userPlayCount || 0).toString()
				)}
			>
				<LastFMIcon />
				{song()?.metadata.userPlayCount || 0}
			</PopupLink>
			<span class={styles.label}>{song()?.connectorLabel}</span>
		</div>
	);
}

/**
 * The compontent for the footer of the now playing popup, showing buttons to control and edit.
 */
function TrackControls(props: {
	song: Accessor<ClonedSong | null>;
	tab: Resource<ManagerTab>;
	setIsEditing: Setter<boolean>;
}) {
	const { song, tab } = props;
	return (
		<div class={styles.controlButtons}>
			<button
				class={styles.controlButton}
				disabled={tab()?.mode !== ControllerMode.Playing}
				title={
					tab()?.mode === ControllerMode.Playing
						? t('infoEditTitle')
						: t('infoEditUnableTitle')
				}
				onClick={() => {
					props.setIsEditing(true);
				}}
			>
				<Edit />
			</button>
			<Show when={song()?.flags.isCorrectedByUser}>
				<button
					class={styles.controlButton}
					disabled={tab()?.mode !== ControllerMode.Playing}
					title={
						tab()?.mode === ControllerMode.Playing
							? t('infoRevertTitle')
							: t('infoRevertUnableTitle')
					}
					onClick={() => {
						sendBackgroundMessage(tab()?.tabId ?? -1, {
							type: 'resetData',
							payload: undefined,
						});
					}}
				>
					<RestartAlt />
				</button>
			</Show>
			<button
				class={`${styles.controlButton}${
					tab()?.mode !== ControllerMode.Scrobbled
						? ` ${styles.hiddenDisabled}`
						: ''
				}${
					tab()?.mode === ControllerMode.Skipped
						? ` ${styles.active}`
						: ''
				}`}
				disabled={tab()?.mode !== ControllerMode.Playing}
				onClick={() => {
					sendBackgroundMessage(tab()?.tabId || -1, {
						type: 'skipCurrentSong',
						payload: undefined,
					});
				}}
				title={t(getSkipLabel(tab))}
			>
				<Block />
			</button>
			<button
				class={`${styles.controlButton}${
					song()?.metadata.userloved ? ` ${styles.active}` : ''
				}`}
				onClick={() => {
					sendBackgroundMessage(tab()?.tabId ?? -1, {
						type: 'toggleLove',
						payload: {
							isLoved: !song()?.metadata.userloved,
						},
					});
				}}
				title={
					song()?.metadata.userloved ? t('infoUnlove') : t('infoLove')
				}
			>
				<span class={styles.nonHover}>
					<Favorite />
				</span>
				<span class={styles.hover}>
					<Show
						when={song()?.metadata.userloved}
						fallback={<Favorite />}
					>
						<HeartBroken />
					</Show>
				</span>
			</button>
		</div>
	);
}

/**
 * Create a link that opens in a new tab
 */
function PopupLink(props: {
	class?: string;
	href: string;
	title: string;
	children: string | JSXElement | JSXElement[];
}) {
	return (
		<a
			class={`${props.class} ${styles.notRedAnchor}`}
			href={props.href}
			target="_blank"
			rel="noopener noreferrer"
			title={props.title}
		>
			{props.children}
		</a>
	);
}

/**
 * Get the correct label for the skip label based on current controller mode
 *
 * @param tab - currently active tab
 * @returns label for skip button
 */
function getSkipLabel(tab: Resource<ManagerTab>): string {
	switch (tab()?.mode) {
		case ControllerMode.Playing:
			return 'infoSkipTitle';
		case ControllerMode.Skipped:
			return 'infoSkippedTitle';
		case ControllerMode.Scrobbled:
			return 'infoSkipUnableTitle';
	}
	return 'infoSkipUnableTitle';
}
