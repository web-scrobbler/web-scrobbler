import { t } from '@/util/i18n';
import styles from './popup.module.scss';
import {
	Match,
	Resource,
	Switch,
	createSignal,
	onCleanup,
	onMount,
} from 'solid-js';
import { ManagerTab } from '@/core/storage/wrapper';
import browser from 'webextension-polyfill';
import ClonedSong from '@/core/object/cloned-song';
import Check from '@suid/icons-material/CheckOutlined';
import Code from '@suid/icons-material/CodeOutlined';
import PublishedWithChanges from '@suid/icons-material/PublishedWithChangesOutlined';
import { sendBackgroundMessage } from '@/util/communication';
import savedEdits from '@/core/storage/saved-edits';
import Regex from './regex';

/**
 * Component that allows the user to edit the currently playing track
 */
export default function Edit(props: { tab: Resource<ManagerTab> }) {
	const { tab } = props;

	const rawTab = tab();
	if (!rawTab) return <></>;
	const rawSong = rawTab.song;
	if (!rawSong) return <></>;
	const clonedSong = new ClonedSong(rawSong, rawTab.tabId);

	const [track, setTrack] = createSignal(clonedSong.getTrack() ?? '');
	const [artist, setArtist] = createSignal(clonedSong.getArtist() ?? '');
	const [album, setAlbum] = createSignal(clonedSong.getAlbum() ?? '');
	const [albumArtist, setAlbumArtist] = createSignal(
		clonedSong.getAlbumArtist() ?? ''
	);
	const [isRegex, setIsRegex] = createSignal(false);

	sendBackgroundMessage(tab()?.tabId ?? -1, {
		type: 'setEditState',
		payload: true,
	});

	// manually set popup width property, safari does not play well with dynamic width
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
		if (nowplaying.scrollWidth > 10) {
			document.body.style.width = `${nowplaying.scrollWidth}px`;
		}
		observer.observe(nowplaying);
	});

	onCleanup(() => {
		sendBackgroundMessage(tab()?.tabId ?? -1, {
			type: 'setEditState',
			payload: false,
		});

		observer.disconnect();
		document.body.style.width = 'auto';
	});

	return (
		<div class={styles.nowPlayingPopup} ref={nowplaying}>
			<Switch>
				<Match when={isRegex()}>
					<Regex clonedSong={clonedSong} tab={tab} />
				</Match>
				<Match when={!isRegex()}>
					<a
						class={styles.coverArtWrapper}
						href={
							clonedSong.getTrackArt() ??
							browser.runtime.getURL('img/cover_art_default.png')
						}
						target="_blank"
						rel="noopener noreferrer"
						title={t('infoOpenAlbumArt')}
					>
						<img
							class={styles.coverArt}
							src={
								clonedSong.getTrackArt() ??
								browser.runtime.getURL(
									'img/cover_art_default.png'
								)
							}
						/>
					</a>
					<div class={styles.songDetails}>
						<input
							class={styles.editField}
							type="text"
							value={clonedSong.getTrack() ?? ''}
							title={t('infoTrackPlaceholder')}
							placeholder={t('infoTrackPlaceholder')}
							onInput={(e) => {
								setTrack(e.currentTarget.value);
							}}
						/>
						<input
							class={styles.editField}
							type="text"
							value={clonedSong.getArtist() ?? ''}
							title={t('infoArtistPlaceholder')}
							placeholder={t('infoArtistPlaceholder')}
							onInput={(e) => {
								setArtist(e.currentTarget.value);
							}}
						/>
						<input
							class={styles.editField}
							type="text"
							value={clonedSong.getAlbum() ?? ''}
							title={t('infoAlbumPlaceholder')}
							placeholder={t('infoAlbumPlaceholder')}
							onInput={(e) => {
								setAlbum(e.currentTarget.value);
							}}
						/>
						<input
							class={styles.editField}
							type="text"
							value={clonedSong.getAlbumArtist() ?? ''}
							title={t('infoAlbumArtistPlaceholder')}
							placeholder={t('infoAlbumArtistPlaceholder')}
							onInput={(e) => {
								setAlbumArtist(e.currentTarget.value);
							}}
						/>
						<div class={styles.controlButtons}>
							<button
								class={styles.controlButton}
								disabled={!track() || !artist()}
								title={
									!track() || !artist()
										? t('infoSubmitUnableTitle')
										: t('infoSubmitTitle')
								}
								onClick={() => {
									saveEdit(tab, clonedSong, {
										artist: artist(),
										track: track(),
										album: album() || null,
										albumArtist: albumArtist() || null,
									});
								}}
							>
								<Check />
							</button>
							<button
								class={styles.controlButton}
								disabled={!track() || !artist()}
								title={
									!track() || !artist()
										? t('infoSwapUnableTitle')
										: t('infoSwapTitle')
								}
								onClick={() => {
									saveEdit(tab, clonedSong, {
										artist: track(),
										track: artist(),
										album: album() || null,
										albumArtist: albumArtist() || null,
									});
								}}
							>
								<PublishedWithChanges />
							</button>
							<button
								class={styles.controlButton}
								title={t('infoRegexTitle')}
								onClick={() => setIsRegex(true)}
							>
								<Code />
							</button>
						</div>
					</div>
				</Match>
			</Switch>
		</div>
	);
}

/**
 * Save edit to storage
 * @param tab - tab data of the tab whose data is being edited
 * @param clonedSong - cloned song from the tab
 * @param data - the new song data to edit to
 */
async function saveEdit(
	tab: Resource<ManagerTab>,
	clonedSong: ClonedSong,
	data: {
		artist: string;
		track: string;
		album: string | null;
		albumArtist: string | null;
	}
) {
	await savedEdits.saveSongInfo(clonedSong, data);
	sendBackgroundMessage(tab()?.tabId ?? -1, {
		type: 'reprocessSong',
		payload: undefined,
	});
}
