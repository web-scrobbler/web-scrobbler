<template>
	<header class="navbar navbar-expand navbar-dark bg-dark sticky-top">
		<nav class="container" aria-label="Main navigation">
			<span class="navbar-brand">Web Scrobbler</span>
			<ul class="navbar-nav ml-sm-auto">
				<li class="nav-item" v-for="item in contactItems" :key="item.title">
					<a
						class="contact-link"
						rel="noopener"
						target="_blank"
						:aria-label="item.title"
						:href="item.href"
						:title="item.title"
					>
						<sprite-icon :icon="item.icon" />
					</a>
				</li>
				<li class="nav-item">
					<button
						class="btn d-md-none p-0 ml-4 contact-link"
						type="button"
						aria-controls="sidebar-tab"
						aria-expanded="false"
						aria-label="Toggle navigation"
						@click="toggleSidebar"
					>
						<sprite-icon :icon="listIcon" />
					</button>
				</li>
			</ul>
		</nav>
	</header>
</template>

<script>
import SpriteIcon from '@/ui/shared/sprite-icon.vue';

import listIcon from 'bootstrap-icons/icons/list.svg';

import discordIcon from 'simple-icons/icons/discord.svg';
import githubIcon from 'simple-icons/icons/github.svg';
import twitterIcon from 'simple-icons/icons/twitter.svg';

const contactItems = [
	{
		icon: discordIcon,
		href: 'https://discord.gg/u99wNWw',
		title: 'Discord',
	},
	{
		icon: githubIcon,
		href: 'https://github.com/web-scrobbler/web-scrobbler',
		title: 'GitHub',
	},
	{
		icon: twitterIcon,
		href: 'https://twitter.com/web_scrobbler',
		title: 'Twitter',
	},
];

export default {
	components: { SpriteIcon },
	data() {
		return {
			listIcon,

			contactItems,

			isSidebarVisible: false,
		};
	},
	methods: {
		toggleSidebar() {
			this.isSidebarVisible = !this.isSidebarVisible;
			this.$emit('onSidebarToggle', this.isSidebarVisible);
		},
	},
};
</script>

<style>
.contact-link {
	color: rgba(255, 255, 255, 0.55);
	padding-left: 0.5rem;
	padding-right: 0.5rem;
}

.contact-link:hover {
	color: rgba(255, 255, 255, 0.75);
}

.contact-link svg {
	height: 1.5rem;
	width: 1.5rem;
}
</style>
