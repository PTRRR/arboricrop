<script lang="ts">
	import { navigating, page } from '$app/stores';
	import Comments from '../../components/comments/Comments.svelte';
	import Mobile from '../../components/Mobile.svelte';
	import Button from '../../components/Button.svelte';
	import Chevron from '../../components/wireframe/Chevron.svelte';
	import Dropdown from '../../components/wireframe/Dropdown.svelte';
	import FooterMenu from '../../components/wireframe/FooterMenu.svelte';
	import Menu from '../../components/wireframe/Menu.svelte';
	import {
		useBlurApp,
		useComments,
		useDevices,
		useFields,
		useNetwork,
		useNotifications,
		useOrganisation,
		useReturnButton,
		useScrollLock,
		useUserName
	} from '../../stores';
	import { strategies } from '../../utils/pairing';
	import { iphone } from '../../utils/phones';
	import type { LayoutData } from './$types';

	export let data: LayoutData;

	const menuActions = [
		{
			label: 'Settings',
			href: '/mobile-wireframe/settings'
		}
	];

	const footerActions = [
		{
			label: 'Pair device',
			href: '/mobile-wireframe/devices/pairing'
		}
	];

	const returnButton = useReturnButton();
	useOrganisation();
	useScrollLock();
	useNetwork();
	useNotifications();
	useFields();
	useDevices();
	useUserName();
	useComments();
	let blurApp = useBlurApp();

	navigating.subscribe(async (navigating) => {
		if (navigating) {
			blurApp.set(false);
		}
	});
</script>

<svelte:head>
	<title>Arboricrop - Mobile Wireframe</title>
</svelte:head>

{#if data.projectId}
	<div class="comments">
		<Comments projectId={data.projectId} />
	</div>
{/if}

<Mobile phone={iphone}>
	<div class="mobile-wireframe">
		<Menu actions={menuActions}>
			{#if $returnButton}
				<Button minimal href={$returnButton.href}>
					<div class="mobile-wireframe__return">
						{#if $returnButton.href}
							<Chevron direction="left" />
						{/if}
						{$returnButton.label || 'Arboricrop'}
					</div>
				</Button>
			{:else}
				<span></span>
			{/if}
			<Button slot="action" let:action href={action.href}>{action.label}</Button>
		</Menu>
		<div class="mobile-wireframe__app" class:mobile-wireframe--blur={$blurApp}>
			<slot />
		</div>
		{#if $page.route.id !== '/mobile-wireframe/settings'}
			<FooterMenu actions={footerActions}>
				<svelte:fragment slot="action" let:action>
					{#if action.label === 'Pair device'}
						<Dropdown items={strategies} label={action.label} align="right" sameWidth>
							<Button slot="item" let:item href={`${action.href}?strategy=${item.value}`}>
								{item.label}
							</Button>
						</Dropdown>
					{:else}
						<Button href={action.href}>{action.label}</Button>
					{/if}
				</svelte:fragment>
			</FooterMenu>
		{/if}
	</div>
</Mobile>

<style>
	.mobile-wireframe {
		width: 100%;
		height: 100%;
		min-height: var(--mobile-app-height);
		background-color: var(--light-gray);
		padding: var(--layout-vertical-padding) var(--main-padding);
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
	}

	.mobile-wireframe__return {
		display: flex;
		align-items: center;
	}

	.mobile-wireframe__app {
		height: 100%;
		flex: 1 1 auto;
		display: flex;
		flex-direction: column;
	}

	.mobile-wireframe--blur {
		opacity: 0.2;
		pointer-events: none;
	}

	@media screen and (max-width: 700px) {
		.mobile-wireframe {
			min-height: 100svh;
		}

		.comments {
			display: none;
		}
	}
</style>
