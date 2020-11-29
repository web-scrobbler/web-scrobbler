<template>
	<div role="tabpanel">
		<div
			class="options-section"
			v-for="(data, scrobblerId) in accountsData"
			:key="scrobblerId"
		>
			<h5>{{ data.scrobbler.getLabel() }}</h5>

			<div class="mb-2">
				<template v-if="data.isSignedIn">
					{{ L`accountsSignedInAs ${data.userName}` }}
				</template>
				<template v-else>
					{{ L`accountsNotSignedIn` }}
				</template>
			</div>

			<div>
				<a
					v-if="data.hasUserProperties"
					class="card-link"
					href="#"
					@click.prevent="showModal(data.scrobbler)"
				>
					{{ L`accountsScrobblerProps` }}
				</a>
				<template v-if="data.isSignedIn">
					<a
						v-if="data.hasProfileUrl"
						class="card-link"
						target="_blank"
						:href="data.profileUrl"
					>
						{{ L`accountsProfile` }}
					</a>
					<a
						class="card-link"
						href="#"
						@click.prevent="signOut(data.scrobbler)"
					>
						{{ L`accountsSignOut` }}
					</a>
				</template>
				<template v-else>
					<a
						class="card-link"
						href="#"
						@click.prevent="signIn(data.scrobbler)"
					>
						{{ L`accountsSignIn` }}
					</a>
				</template>
			</div>
		</div>
		<user-properties-modal
			v-if="isModalActive"
			:label="editedAccount.getLabel()"
			:properties="createUserProperties(editedAccount)"
			@on-save-properties="saveUserProperties"
			@on-modal-close="hideModal"
		/>
	</div>
</template>

<script>
import { browser } from 'webextension-polyfill-ts';

import UserPropertiesModal from '@/ui/options/modals/user-properties-modal.vue';

import { ScrobbleManager } from '@/background/scrobbler/scrobble-manager';

import { getCurrentTab } from '@/common/util-browser';
import { Request, sendMessageToAll } from '@/common/messages';

const anonimousName = 'anonimous';

async function makeAccountsDataFromScrobbler(scrobbler) {
	let userName = null;
	let profileUrl = null;
	let isSignedIn = false;
	let hasProfileUrl = false;

	const hasUserProperties = scrobbler.getUsedDefinedProperties().length > 0;

	try {
		const { sessionName } = await scrobbler.getSession();

		profileUrl = await scrobbler.getProfileUrl();
		userName = sessionName || anonimousName;

		isSignedIn = true;
		hasProfileUrl = profileUrl !== null;
	} catch (err) {
		// Do nothing
	}

	return {
		isSignedIn,
		hasProfileUrl,
		hasUserProperties,
		profileUrl,
		scrobbler,
		userName,
	};
}

const scrobblerPropertiesMap = {
	listenbrainz: {
		userApiUrl: {
			titleId: 'accountsUserApiUrl',
			placeholderId: 'accountsUserApiUrlPlaceholder',
		},
		userToken: {
			type: 'password',
			titleId: 'accountsUserToken',
			placeholderId: 'accountsUserTokenPlaceholder',
		},
	},
	maloja: {
		userApiUrl: {
			titleId: 'accountsUserApiUrl',
			placeholderId: 'accountsUserApiUrlPlaceholder',
		},
		userToken: {
			type: 'password',
			titleId: 'accountsUserToken',
			placeholderId: 'accountsUserTokenPlaceholder',
		},
	},
};

export default {
	data() {
		return {
			accountsData: {},
			optionsTab: null,

			isModalActive: false,
			editedAccount: null,
		};
	},
	created() {
		this.addTabListener();
		this.loadAccounts();
	},
	beforeDestroy() {
		this.removeTabListener();
	},
	components: { UserPropertiesModal },
	methods: {
		async loadAccounts() {
			const accountsData = {};
			const scrobblers = ScrobbleManager.getRegisteredScrobblers();

			for (const scrobbler of scrobblers) {
				accountsData[
					scrobbler.getId()
				] = await makeAccountsDataFromScrobbler(scrobbler);
			}

			this.accountsData = accountsData;
		},

		async addTabListener() {
			this.optionsTab = await getCurrentTab();

			browser.tabs.onActivated.addListener(this.onTabChanged);
		},

		removeTabListener() {
			browser.tabs.onActivated.removeListener(this.onTabChanged);
		},

		onTabChanged(activeInfo) {
			if (this.optionsTab.id === activeInfo.tabId) {
				this.loadAccounts();
			}
		},

		createUserProperties(scrobbler) {
			const properties = [];

			const scrobblerId = scrobbler.getId();
			const scrobblerProperties = scrobblerPropertiesMap[scrobblerId];

			for (const name of scrobbler.getUsedDefinedProperties()) {
				const { type, titleId, placeholderId } = scrobblerProperties[
					name
				];
				const value = scrobbler[name];

				properties.push({ name, value, type, titleId, placeholderId });
			}

			return properties;
		},

		async saveUserProperties(properties) {
			const scrobblerId = this.editedAccount.getId();

			await sendMessageToAll(Request.ApplyUserProperties, {
				scrobblerId,
				properties,
			});
			await this.refreshAccount(this.editedAccount);

			this.hideModal();
		},

		signIn(scrobbler) {
			sendMessageToAll(Request.SignIn, {
				scrobblerId: scrobbler.getId(),
			});
		},

		async signOut(scrobbler) {
			await sendMessageToAll(Request.SignOut, {
				scrobblerId: scrobbler.getId(),
			});
			await this.refreshAccount(scrobbler);
		},

		async refreshAccount(scrobbler) {
			this.accountsData[
				scrobbler.getId()
			] = await makeAccountsDataFromScrobbler(scrobbler);
		},

		hideModal() {
			this.isModalActive = false;
		},

		showModal(scrobbler) {
			this.editedAccount = scrobbler;
			this.isModalActive = true;
		},
	},
};
</script>
