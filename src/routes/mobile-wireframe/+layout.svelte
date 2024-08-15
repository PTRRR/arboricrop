<script lang="ts">
	import Mobile from '../../components/Mobile.svelte';
	import Button from '../../components/wireframe/Button.svelte';
	import FooterMenu from '../../components/wireframe/FooterMenu.svelte';
	import Menu from '../../components/wireframe/Menu.svelte';
	import { iphone } from '../../utils/phones';

	let menuActions = [
		{
			label: 'Home',
			href: '/mobile-wireframe'
		},
		{
			label: 'User',
			href: '/mobile-wireframe/user'
		}
	];

	let footerActions = [
		{
			label: 'Devices',
			href: '/mobile-wireframe/devices'
		},
		{
			label: 'Plantations',
			href: '/mobile-wireframe/user'
		},
		{
			label: 'Map',
			href: '/mobile-wireframe/user'
		}
	];
</script>

<Mobile phone={iphone}>
	<div class="mobile-wireframe">
		<Menu actions={menuActions}>
			<Button href="/mobile-wireframe/user">Hello</Button>
			<Button slot="action" let:action href={action.href}>{action.label}</Button>
		</Menu>
		<slot />
		<FooterMenu actions={footerActions}>
			<Button slot="action" let:action href={action.href}>{action.label}</Button>
		</FooterMenu>
	</div>
</Mobile>

<style>
	.mobile-wireframe {
		width: 100%;
		height: 100%;
		background-color: var(--light-gray);
		padding: 7rem 1rem;
		box-sizing: border-box;
	}
</style>
