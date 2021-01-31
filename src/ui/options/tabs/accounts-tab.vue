<template>
	<div role="tabpanel">
		<div
			class="options-section"
			v-for="account in accountsData"
			:key="account.scrobblerId"
		>
			<h5>{{ account.scrobblerLabel }}</h5>

			<div class="mb-2">
				<template v-if="account.username">
					{{ L`accountsSignedInAs ${account.username}` }}
				</template>
				<template v-else>
					{{ L`accountsNotSignedIn` }}
				</template>
			</div>

			<div>
				<a
					v-if="false"
					class="card-link"
					href="#"
					@click.prevent="showModal(data.scrobbler)"
				>
					{{ L`accountsScrobblerProps` }}
				</a>
				<template v-if="account.username">
					<a
						v-if="account.profileUrl"
						class="card-link"
						target="_blank"
						:href="account.profileUrl"
					>
						{{ L`accountsProfile` }}
					</a>
					<a
						class="card-link"
						href="#"
						@click.prevent="signOut(account.scrobblerId)"
					>
						{{ L`accountsSignOut` }}
					</a>
				</template>
				<template v-else>
					<a
						class="card-link"
						href="#"
						@click.prevent="signIn(account.scrobblerId)"
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
import UserPropertiesModal from '@/ui/options/modals/user-properties-modal.vue';

import { getAccountsCommunicator } from '@/communication/CommunicatorFactory';

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

const accountsCommunicator = getAccountsCommunicator();

export default {
	data() {
		return {
			accountsData: {},

			isModalActive: false,
			editedAccount: null,
		};
	},
	created() {
		this.loadAccounts();
	},
	components: { UserPropertiesModal },
	methods: {
		async loadAccounts() {
			this.accountsData = await accountsCommunicator.getAccounts();
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
			// const scrobblerId = this.editedAccount.getId();

			// await sendMessageToAll(Request.ApplyUserProperties, {
			// 	scrobblerId,
			// 	properties,
			// });
			// await this.loadAccounts();

			this.hideModal();
		},

		async signIn(scrobblerId) {
			await accountsCommunicator.signIn(scrobblerId);
			await this.loadAccounts();
		},

		async signOut(scrobblerId) {
			await accountsCommunicator.signOut(scrobblerId);
			await this.loadAccounts();
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
