import { t } from '@/util/i18n';
import ScrobbleService, {
	Scrobbler,
	ScrobblerLabel,
} from '@/core/object/scrobble-service';
import { For, Show, createResource, onCleanup } from 'solid-js';
import styles from './components.module.scss';
import browser from 'webextension-polyfill';
import { debugLog } from '@/util/util';

/**
 * Properties associated with each scrobbler, and the input type to use for the user to edit them.
 */
const scrobblerPropertiesMap = {
	ListenBrainz: {
		userApiUrl: {
			type: 'text',
			title: 'accountsUserApiUrl',
			placeholder: 'accountsUserApiUrlPlaceholder',
		},
		userToken: {
			type: 'password',
			title: 'accountsUserToken',
			placeholder: 'accountsUserTokenPlaceholder',
		},
	},
	Maloja: {
		userApiUrl: {
			type: 'text',
			title: 'accountsUserApiUrl',
			placeholder: 'accountsUserApiUrlPlaceholder',
		},
		userToken: {
			type: 'password',
			title: 'accountsUserToken',
			placeholder: 'accountsUserTokenPlaceholder',
		},
	},
};

/**
 * Component that allows the user to sign in and out of their scrobbler accounts
 */
export default function Accounts() {
	return (
		<>
			<h1>{t('optionsAccounts')}</h1>
			<ScrobblerDisplay label="Last.fm" />
			<ScrobblerDisplay label="Libre.fm" />
			<ScrobblerDisplay label="ListenBrainz" />
			<ScrobblerDisplay label="Maloja" />
		</>
	);
}

/**
 * Component that allows the user to sign in and out of a specific scrobbler
 */
function ScrobblerDisplay(props: { label: ScrobblerLabel }) {
	const { label } = props;
	const rawScrobbler = ScrobbleService.getScrobblerByLabel(label);
	if (!rawScrobbler) return <></>;
	const [session, setSession] = createResource(
		rawScrobbler.getSession.bind(rawScrobbler)
	);
	const [profileUrl, setProfileUrl] = createResource(
		rawScrobbler.getProfileUrl.bind(rawScrobbler)
	);

	const onFocus = async () => {
		try {
			if (await rawScrobbler.isReadyForGrantAccess()) {
				await rawScrobbler.getSession();
				setSession.refetch();
				setProfileUrl.refetch();
			}
		} catch (err) {
			debugLog(
				`${rawScrobbler.getLabel()}: Error while fetching session`,
				'warn'
			);
			debugLog(err, 'warn');
		}
	};
	window.addEventListener('focus', onFocus);
	onCleanup(() => window.removeEventListener('focus', onFocus));

	return (
		<>
			<Show when={!session.error && session()}>
				<h2>{rawScrobbler.getLabel()}</h2>
				<p>
					{t(
						'accountsSignedInAs',
						session()?.sessionName || 'anonymous'
					)}
				</p>
				<div class={styles.buttonContainer}>
					<a
						class={styles.linkButton}
						href={profileUrl.error ? '#' : profileUrl()}
						target="_blank"
						rel="noopener noreferrer"
					>
						{t('accountsProfile')}
					</a>
					<button
						class={styles.resetButton}
						onClick={async () => {
							await rawScrobbler.signOut();
							setSession.refetch();
							setProfileUrl.refetch();
						}}
					>
						{t('accountsSignOut')}
					</button>
				</div>
				<Properties scrobbler={rawScrobbler} />
			</Show>
			<Show when={session.error || !session()}>
				<SignedOut scrobbler={rawScrobbler} />
			</Show>
		</>
	);
}

/**
 * Text to show when a user is not signed into a scrobbler.
 */
function SignedOut(props: { scrobbler: Scrobbler }) {
	const { scrobbler } = props;
	return (
		<>
			<h2>{scrobbler.getLabel()}</h2>
			<p>{t('accountsNotSignedIn')}</p>
			<button
				class={styles.resetButton}
				onClick={async () => {
					const url = await scrobbler.getAuthUrl();
					if (!url) return new Error('No auth URL');
					await browser.tabs.create({ url });
				}}
			>
				{t('accountsSignIn')}
			</button>
			<Properties scrobbler={scrobbler} />
		</>
	);
}

/**
 * Component that allows the user to edit scrobbler properties for the scrobblers that support them.
 */
function Properties(props: { scrobbler: Scrobbler }) {
	const { scrobbler } = props;
	const label = scrobbler.getLabel();
	if (!labelHasProperties(label)) return <></>;
	const [properties, setProperties] = createResource(
		scrobbler.getUserProperties.bind(scrobbler)
	);
	return (
		<>
			<h3>{t('accountsScrobblerProps')}</h3>
			<For each={Object.entries(scrobblerPropertiesMap[label])}>
				{([key, { type, title, placeholder }]) => {
					const typedKey =
						key as keyof (typeof scrobblerPropertiesMap)[typeof label];
					return (
						<label class={styles.propLabel}>
							{t(title)}
							<input
								class={styles.propInput}
								type={type}
								value={properties()?.[typedKey] || ''}
								placeholder={t(placeholder)}
								onInput={(e) => {
									setProperties.mutate((o) => {
										if (!o) o = {};
										o[typedKey] = e.currentTarget.value;
										scrobbler.applyUserProperties(o);
										return o;
									});
								}}
							/>
						</label>
					);
				}}
			</For>
		</>
	);
}

/**
 * Check if a scrobbler has user-set properties associated with it.
 *
 * @param label - scrobbler to check if has properties
 * @returns true if scrobbler has properties, false if not
 */
function labelHasProperties(
	label: ScrobblerLabel
): label is keyof typeof scrobblerPropertiesMap {
	return label in scrobblerPropertiesMap;
}
