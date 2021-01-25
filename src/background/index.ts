import { browser } from 'webextension-polyfill-ts';
import Logger from 'js-logger';

import { Extension } from '@/background/extension';
import { migrate } from '@/background/util/migrate';

import { getCoreRepository } from '@/background/repository/GetCoreRepository';
import { createScrobblerManager } from '@/background/scrobbler/ScrobblerManagerFactory';
import { AuthenticateHelper } from '@/background/authenticator/AuthenticateHelper';
import { getAccountsRepository } from '@/background/repository/GetAccountsRepository';
import { createAuthenticator } from '@/background/authenticator/ScrobblerAuthenticatorFactory';
import { ScrobblerId } from '@/background/scrobbler/ScrobblerId';
import { createScrobbler } from '@/background/scrobbler/ScrobblerFactory';
import { createAuthRemindFunction } from '@/background/auth-remind/AuthRemindFunctionFactory';
import { AudioScrobblerScrobbleService } from '@/background/scrobbler/audioscrobbler/AudioScrobblerScrobbleService';
import { LastFmAppInfo } from '@/background/scrobbler/audioscrobbler/LastFmAppInfo';
import { LibreFmScrobbleService } from '@/background/scrobbler/audioscrobbler/LibreFmScrobbleService';
import { LibreFmAppInfo } from '@/background/scrobbler/audioscrobbler/LibreFmAppInfo';
import { ExternalTrackInfoProvider } from '@/background/provider/ExternalTrackInfoProvider';
import { createSongStub } from '#/stub/SongStubFactory';
import { SongPipeline } from '@/background/pipeline/SongPipeline';
import { Processor } from '@/background/pipeline/Processor';
import { Song } from '@/background/model/song/Song';
import { FieldNormalizer } from '@/background/pipeline/processor/FieldNormalizer';
import { CoverArtArchiveProvider } from '@/background/provider/CoverArtArchiveProvider';
import { CoverArtProcessor } from '@/background/pipeline/processor/CoverArtProcessor';
import { EditedTracks } from '@/background/repository/edited-tracks/EditedTracks';
import { EditedInfoProcessor } from '@/background/pipeline/processor/EditedInfoProcessor';
import { ScrobblerSession } from '@/background/account/ScrobblerSession';
import { ExternalTrackInfoLoader } from '@/background/pipeline/processor/ExternalTrackInfoLoader';
import { TrackContextInfoProvider } from '@/background/provider/TrackContextInfoProvider';
import { TrackContextInfoLoader } from '@/background/pipeline/processor/TrackContextInfoLoader';
import { getEditedTracks } from '@/background/repository/GetEditedTracks';

main();

async function main() {
	Logger.useDefaults({ defaultLevel: Logger.DEBUG });

	await migrate();
	updateCoreVersion();

	const remindFn = createAuthRemindFunction();
	new Extension(remindFn).start();

	const accountsRepository = getAccountsRepository();
	const scrobbleManager = await createScrobblerManager(
		accountsRepository,
		createScrobbler
	);

	// const helper = new AuthenticateHelper(
	// 	scrobbleManager,
	// 	accountsRepository,
	// 	createScrobbler,
	// 	createAuthenticator
	// );
	// await helper.signIn(ScrobblerId.Maloja);

	// const account = await accountsRepository.getAccount(ScrobblerId.LibreFm);
	// const songInfoProvider: ExternalTrackInfoProvider = new AudioScrobblerScrobbleService(
	// 	account.getSession(),
	// 	LibreFmAppInfo
	// );

	// console.log(
	// 	await songInfoProvider.getExternalTrackInfo({
	// 		artist: 'Tool',
	// 		track: 'Lateralus',
	// 		album: 'Lateralus',
	// 	})
	// );

	const editedTracks = getEditedTracks();

	const pipeline = createTrackPipeline(editedTracks, scrobbleManager);

	const song = createSongStub({ artist: 'Tool', track: 'Lateralus' });
	await pipeline.process(song);
}

function updateCoreVersion() {
	const { version } = browser.runtime.getManifest();

	const coreRepository = getCoreRepository();
	coreRepository.setExtensionVersion(version);
}

function createTrackPipeline(
	editedTracks: EditedTracks,
	trackContextInfoProvider: TrackContextInfoProvider
): Processor<Song> {
	const fieldNormalizer = new FieldNormalizer();

	const coverArtProvider = new CoverArtArchiveProvider();
	const coverArtProcessor = new CoverArtProcessor(coverArtProvider);

	const editedInfoProcessor = new EditedInfoProcessor(editedTracks);

	const trackInfoProvider = new AudioScrobblerScrobbleService(
		ScrobblerSession.createEmptySession(),
		LastFmAppInfo
	);
	const externalTrackInfoLoader = new ExternalTrackInfoLoader(
		trackInfoProvider
	);

	const trackContextInfoLoader = new TrackContextInfoLoader(
		trackContextInfoProvider
	);

	const processors = [
		fieldNormalizer,
		editedInfoProcessor,
		externalTrackInfoLoader,
		trackContextInfoLoader,
		coverArtProcessor,
	];
	return new SongPipeline(processors);
}
