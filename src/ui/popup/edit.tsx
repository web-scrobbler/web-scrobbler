import { t } from '@/util/i18n';
import styles from './popup.module.scss';
import { Resource, createSignal, onCleanup } from 'solid-js';
import { ManagerTab } from '@/core/storage/wrapper';
import browser from 'webextension-polyfill';
import ClonedSong from '@/core/object/cloned-song';
import Check from '@suid/icons-material/CheckOutlined';
import PublishedWithChanges from '@suid/icons-material/PublishedWithChangesOutlined';
import { sendBackgroundMessage } from '@/util/communication';
import savedEdits from '@/core/storage/saved-edits';

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

	sendBackgroundMessage(tab()?.tabId ?? -1, {
		type: 'setEditState',
		payload: true,
	});

	onCleanup(() => {
		sendBackgroundMessage(tab()?.tabId ?? -1, {
			type: 'setEditState',
			payload: false,
		});
	});

	return (
		<div class={styles.nowPlayingPopup}>
			<a
				class={styles.coverArtWrapper}
				href={
					clonedSong.getTrackArt() ??
					browser.runtime.getURL('icons/cover_art_default.png')
				}
				target="_blank"
				rel="noopener noreferrer"
				title={t('infoOpenAlbumArt')}
			>
				<img
					class={styles.coverArt}
					src={
						clonedSong.getTrackArt() ??
						browser.runtime.getURL('icons/cover_art_default.png')
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
				</div>
			</div>
		</div>
	);
}

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
