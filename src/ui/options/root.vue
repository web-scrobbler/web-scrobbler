<template>
	<div>
		<root-header @onSidebarToggle="toggleSidebar" />
		<div class="container my-4 options-layout">
			<div class="sidebar">
				<div
					class="nav collapse sidebar-links mb-4"
					:class="{ show: isSidebarVisible }"
				>
					<a
						class="nav-link sidebar-link"
						role="tab"
						v-for="(tabData, tabName) in tabs"
						:key="tabData.titleId"
						:href="`#${tabName}`"
						:class="{ active: currentTabName === tabName }"
					>
						<sprite-icon
							class="sidebar-link__icon"
							:icon="tabData.icon"
						/>
						<span class="sidebar-link__title">{{
							L(tabData.titleId)
						}}</span>
					</a>
				</div>
			</div>
			<div class="content">
				<transition name="fade" mode="out-in">
					<keep-alive>
						<component :is="currentTab" />
					</keep-alive>
				</transition>
			</div>
		</div>
	</div>
</template>

<script>
import RootHeader from '@/ui/options/root-header.vue';

import AboutTab from '@/ui/options/tabs/about-tab.vue';
import AccountsTab from '@/ui/options/tabs/accounts-tab.vue';
import ConnectorsTab from '@/ui/options/tabs/connectors-tab.vue';
import FaqTab from '@/ui/options/tabs/faq-tab.vue';
import OptionsTab from '@/ui/options/tabs/options-tab.vue';
import TracksTab from '@/ui/options/tabs/tracks-tab.vue';
import StorageTab from '@/ui/options/tabs/storage-tab.vue';

import SpriteIcon from '@/ui/shared/sprite-icon.vue';

import hddIcon from 'bootstrap-icons/icons/hdd.svg';
import gearIcon from 'bootstrap-icons/icons/gear.svg';
import peopleIcon from 'bootstrap-icons/icons/people.svg';
import globe2Icon from 'bootstrap-icons/icons/globe2.svg';
import infoCircleIcon from 'bootstrap-icons/icons/info-circle.svg';
import musicNoteListIcon from 'bootstrap-icons/icons/music-note-list.svg';
import questionCircleIcon from 'bootstrap-icons/icons/question-circle.svg';

export default {
	components: {
		RootHeader,
		SpriteIcon,

		AboutTab,
		AccountsTab,
		ConnectorsTab,
		FaqTab,
		OptionsTab,
		StorageTab,
		TracksTab,
	},
	mounted() {
		window.addEventListener(
			'hashchange',
			() => {
				this.updateTab();
			},
			false
		);
		this.updateTab();
	},
	data() {
		return {
			currentTab: AboutTab,
			currentTabName: 'about',
			tabs: {
				accounts: {
					component: AccountsTab,
					icon: peopleIcon,
					titleId: 'accountsSidebarTitle',
				},
				options: {
					component: OptionsTab,
					icon: gearIcon,
					titleId: 'optionsSidebarTitle',
				},
				connectors: {
					component: ConnectorsTab,
					icon: globe2Icon,
					titleId: 'connectorsSidebarTitle',
				},
				tracks: {
					component: TracksTab,
					icon: musicNoteListIcon,
					titleId: 'tracksSidebarTitle',
				},
				storage: {
					component: StorageTab,
					icon: hddIcon,
					titleId: 'storageSidebarTitle',
				},
				faq: {
					component: FaqTab,
					icon: questionCircleIcon,
					titleId: 'faqSidebarTitle',
				},
				about: {
					component: AboutTab,
					icon: infoCircleIcon,
					titleId: 'aboutSidebarTitle',
				},
			},

			isSidebarVisible: false,
		};
	},
	methods: {
		toggleSidebar(isVisible) {
			this.isSidebarVisible = isVisible;
		},

		updateTab() {
			const hashName = location.hash.slice(1);
			if (hashName in this.tabs) {
				this.currentTabName = hashName;
				this.currentTab = this.tabs[this.currentTabName].component;
			}
		},
	},
};
</script>

<style>
/* Always show scrollbar */

body {
	overflow-y: scroll !important;
}
body.modal-open {
	padding-right: 0px !important;
}

@media (min-width: 768px) {
	.options-layout {
		column-gap: 1rem;
		display: grid;
		grid-template-areas: 'sidebar content';
		grid-template-columns: 25% 75%;
	}

	.sidebar-links {
		display: flex !important;
		position: sticky;
		top: 5rem;
	}

	.sidebar-link__title {
		display: inline !important;
		margin-left: 0.5rem;
	}
}

.sidebar {
	grid-area: sidebar;
}

.sidebar-link {
	color: rgba(0, 0, 0, 0.85);
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.sidebar-link:hover {
	background-color: rgba(0, 0, 0, 0.1);
	border-radius: 6px;
	color: var(--color-active);
}

.sidebar-links .active {
	color: var(--color-accent);
	font-weight: 600;
}

.sidebar-link__icon {
	height: 1.5rem;
	vertical-align: top;
	width: 1.5rem;
}

.sidebar-link__title {
	display: none;
}

.content {
	grid-area: content;
	padding-left: 1rem;
	padding-right: 1rem;
}

.container {
	max-width: 768px;
}

.options-section {
	margin-bottom: 2rem;
}

.options-section:last-child {
	margin-bottom: 1rem;
}

.fade-leave-active {
	opacity: 0;
	transition: all 0.2s;
}
</style>
