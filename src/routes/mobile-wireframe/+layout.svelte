<script lang="ts">
	import Mobile from '../../components/Mobile.svelte';
	import Button from '../../components/wireframe/Button.svelte';
	import Chevron from '../../components/wireframe/Chevron.svelte';
	import Dropdown from '../../components/wireframe/Dropdown.svelte';
	import FooterMenu from '../../components/wireframe/FooterMenu.svelte';
	import Menu from '../../components/wireframe/Menu.svelte';
	import { useDevices, useReturnButton } from '../../stores';
	import { strategies } from '../../utils/pairing';
	import { iphone } from '../../utils/phones';

	const menuActions = [
		{
			label: 'Settings',
			href: '/mobile-wireframe/settings'
		}
	];

	const footerActions = [
		{
			label: 'Home',
			href: '/mobile-wireframe'
		},
		{
			label: 'Devices',
			href: '/mobile-wireframe/devices'
		},
		{
			label: 'Pair device',
			href: '/mobile-wireframe/devices/pairing'
		}
	];

	let returnButton = useReturnButton();
	useDevices();
</script>

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
		<slot />
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
	</div>
</Mobile>

<style>
	.mobile-wireframe {
		width: 100%;
		height: 100%;
		min-height: var(--mobile-app-height);
		background-color: var(--light-gray);
		padding: 7rem 1.5rem;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
	}

	.mobile-wireframe__return {
		display: flex;
		align-items: center;
	}
</style>
