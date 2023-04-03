import { t } from '@/util/i18n';
import styles from './popup.module.scss';
import {
	Match,
	Resource,
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
					<a
						class={styles.coverArtWrapper}
						href={
							song()?.getTrackArt() ??
							browser.runtime.getURL(
								'icons/cover_art_default.png'
							)
						}
						target="_blank"
						rel="noopener noreferrer"
						title={t('infoOpenAlbumArt')}
					>
						<img
							class={styles.coverArt}
							src={
								song()?.getTrackArt() ??
								browser.runtime.getURL(
									'icons/cover_art_default.png'
								)
							}
						/>
					</a>
					<div class={styles.songDetails}>
						<span class={styles.bold}>{song()?.getTrack()}</span>
						<span>{song()?.getArtist()}</span>
						<span>{song()?.getAlbum()}</span>
						<span>{song()?.getAlbumArtist()}</span>
						<div class={styles.playDetails}>
							<span class={`${styles.playCount} ${styles.label}`}>
								<LastFMIcon />
								{song()?.metadata.userPlayCount || 0}
							</span>
							<span class={styles.label}>
								{song()?.connectorLabel}
							</span>
						</div>
						<div class={styles.controlButtons}>
							<button
								class={styles.controlButton}
								disabled={
									tab()?.mode !== ControllerMode.Playing
								}
								title={
									tab()?.mode === ControllerMode.Playing
										? t('infoEditTitle')
										: t('infoEditUnableTitle')
								}
								onClick={() => {
									setIsEditing(true);
								}}
							>
								<Edit />
							</button>
							<Show when={song()?.flags.isCorrectedByUser}>
								<button
									class={styles.controlButton}
									disabled={
										tab()?.mode !== ControllerMode.Playing
									}
									title={
										tab()?.mode === ControllerMode.Playing
											? t('infoRevertTitle')
											: t('infoRevertUnableTitle')
									}
									onClick={() => {
										sendBackgroundMessage(
											tab()?.tabId ?? -1,
											{
												type: 'resetData',
												payload: undefined,
											}
										);
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
								disabled={
									tab()?.mode !== ControllerMode.Playing
								}
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
									song()?.metadata.userloved
										? ` ${styles.active}`
										: ''
								}`}
								onClick={() => {
									sendBackgroundMessage(tab()?.tabId ?? -1, {
										type: 'toggleLove',
										payload: {
											isLoved:
												!song()?.metadata.userloved,
										},
									});
								}}
								title={
									song()?.metadata.userloved
										? t('infoUnlove')
										: t('infoLove')
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
					</div>
				</div>
			</Match>
		</Switch>
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
