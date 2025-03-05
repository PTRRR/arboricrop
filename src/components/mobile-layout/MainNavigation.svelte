<script lang="ts">
	import { onNavigate } from '$app/navigation';
	import { LAYOUT_PORTAL } from '../../routes/mobile-mvp/+layout.svelte';
	import { useApp, useCurrentAccount } from '../../stores';
	import { portal } from '../../utils/portal';
	import Stack from '../desktop/Stack.svelte';
	import Button from '../layout/Button.svelte';
	import ActionMenu from './ActionMenu.svelte';
	import Panel from './Panel.svelte';
	import PanelOverlay from './PanelOverlay.svelte';

	interface Props {
		baseUrl: string;
	}

	const { baseUrl }: Props = $props();
	const { isBlurred, showSplashscreen, showAppMenu, actionMenuSnippets } = useApp();
	const { currentAccount } = useCurrentAccount();
	const show = $derived(!$showSplashscreen && $showAppMenu);
	const hideButton = $derived(
		$showSplashscreen || $actionMenuSnippets.length > 0 || !$currentAccount
	);

	$effect(() => {
		$isBlurred = $showAppMenu;
	});

	onNavigate(() => {
		$showAppMenu = false;
	});
</script>

<div class="main-navigation" use:portal={LAYOUT_PORTAL}>
	<Button
		style={{
			position: 'absolute',
			bottom: '1.3rem',
			left: '50%',
			transition: 'transform 0.5s cubic-bezier(0.83, 0, 0.17, 1)',
			transform: hideButton ? 'translate(-50%, calc(100% + 1.3rem))' : 'translate(-50%, 0)',
			boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
			zIndex: '100'
		}}
		icon={show ? 'cross' : 'menu'}
		iconSize="large"
		backgroundColor="var(--light-grey)"
		onclick={() => ($showAppMenu = !$showAppMenu)}
	></Button>

	<Panel state={show ? 'mounting' : 'unmounting'}>
		<div class="main-navigation__links">
			<a href={`${baseUrl}/`}>Hub</a>
			<a href={`${baseUrl}/`}>Trials</a>
			<a href={`${baseUrl}/notifications`}>Notifications</a>
			<a href={`${baseUrl}/account`}>Account</a>
		</div>
	</Panel>
</div>

<style lang="scss">
	.main-navigation {
		display: contents;

		&__links {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			gap: 0.5rem;

			a {
				color: black;
				text-decoration: none;
				font-size: var(--big-font-size);
			}
		}
	}
</style>
