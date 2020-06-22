<template>
	<div role="tabpanel">
		<div class="options-section">
			<h5>{{ L('aboutSidebarTitle') }}</h5>
			<p>{{ L('aboutExtensionDesc') }}</p>
		</div>

		<div class="options-section">
			<h5>{{ L('aboutLinksTitle') }}</h5>
			<ul>
				<li v-for="(link, stringId) in links" :key="stringId">
					<a target="_blank" :href="link">
						{{ L(stringId) }}
					</a>
				</li>
			</ul>
		</div>

		<div class="options-section">
			<h5>{{ L('aboutShowSomeLoveTitle') }}</h5>
			<p>{{ L('aboutShowSomeLoveText1') }}</p>
			<p>{{ L('aboutShowSomeLoveText2') }}</p>

			<div class="text-center">
				<a
					href="https://ko-fi.com/R6R21HYBD"
					class="btn btn-primary"
					target="_blank"
				>
					<sprite-icon :icon="kofiIcon" class="btn-icon" />
					Support me on Ko-fi
				</a>
			</div>
		</div>
	</div>
</template>

<script>
import { runtime } from 'webextension-polyfill';
import { getPrivacyPolicyFilename } from 'util/util-browser';

import SpriteIcon from '@/ui/shared/sprite-icon.vue';

import kofiIcon from 'simple-icons/icons/ko-fi.svg';

const GITHUB_RELEASES_URL =
	'https://github.com/web-scrobbler/web-scrobbler/releases/tag';
const GITHUB_RAW_SRC =
	'https://github.com/web-scrobbler/web-scrobbler/blob/master/src';

const extVersion = runtime.getManifest().version;

const links = {
	aboutReleaseNotesTitle: `${GITHUB_RELEASES_URL}/v${extVersion}`,
	aboutFullChangelogTitle:
		'https://github.com/web-scrobbler/web-scrobbler/releases',
	aboutContributorsTitle:
		'https://github.com/web-scrobbler/web-scrobbler/graphs/contributors',
};

async function getPrivacyPolicyUrl() {
	const privacyPolicyFile = await getPrivacyPolicyFilename();
	return `${GITHUB_RAW_SRC}/${privacyPolicyFile}`;
}

export default {
	data() {
		return { links, kofiIcon };
	},
	created() {
		this.fetchPrivacyLink();
	},
	components: { SpriteIcon },
	methods: {
		async fetchPrivacyLink() {
			this.$set(
				this.links,
				'aboutPrivacyPolicyTitle',
				await getPrivacyPolicyUrl()
			);
		},
	},
};
</script>

<style>
.btn-icon {
	height: 1.25rem;
	margin-right: 0.25rem;
	width: 1.25rem;
}
</style>
