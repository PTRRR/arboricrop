<script lang="ts">
	import { onNavigate } from '$app/navigation';
	import { LAYOUT_PORTAL } from '../../routes/mobile-mvp/+layout.svelte';
	import { useApp } from '../../stores';
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
	const { isBlurred, showSplashscreen, showAppMenu } = useApp();
	const show = $derived(!$showSplashscreen && $showAppMenu);
	const hideButton = $derived($showSplashscreen);

	$effect(() => {
		$isBlurred = $showAppMenu;
	});

	onNavigate(() => {
		$showAppMenu = false;
	});
</script>

<div class="main-navigation" use:portal={LAYOUT_PORTAL}>
	<Panel state={show ? 'mounting' : 'unmounting'}>
		<Button
			style={{
				position: 'absolute',
				top: '0',
				left: '50%',
				transition: 'transform 0.5s cubic-bezier(0.83, 0, 0.17, 1)',
				transform: hideButton ? 'translate(-50%, 0)' : 'translate(-50%, calc(-100% - 1.3rem))',
				boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.3)'
			}}
			icon={show ? 'cross' : 'menu'}
			iconSize="large"
			onclick={() => ($showAppMenu = !$showAppMenu)}
		></Button>

		<div class="main-navigation__links">
			<a href={`${baseUrl}/`}>Trials</a>
			<a href={`${baseUrl}/notifications`}>Notifications</a>
			<a href={`${baseUrl}/settings`}>Settings</a>
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
			gap: 1rem;

			a {
				color: black;
				text-decoration: none;
				font-size: var(--big-font-size);
			}
		}
	}
</style>
