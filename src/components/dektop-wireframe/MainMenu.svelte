<script>
	import Button from '../wireframe/Button.svelte';
	import Dropdown from '../wireframe/Dropdown.svelte';
</script>

<div class="main-menu">
	<span>Arboricrop</span>
	<div class="main-menu-section main-menu__right-section">
		<Button href="/desktop-wireframe/dashboard">Dashboard</Button>
		<Button href="/desktop-wireframe/fields">Fields</Button>
		<Dropdown
			label="Settings"
			items={[
				{ label: 'Profile', href: '/desktop-wireframe/profile' },
				{ label: 'Account', href: '/desktop-wireframe/account' }
			]}
			align="right"
		>
			<Button slot="item" let:item href={item.href}>{item.label}</Button>
		</Dropdown>
	</div>
</div>

<style>
	.main-menu {
		display: flex;
		position: sticky;
		z-index: 10;
		top: 0;
		width: 100%;
		align-items: center;
		justify-content: space-between;
		padding: 0.5rem 1rem;
		box-sizing: border-box;
		border-bottom: solid 1px var(--black);
		background-color: var(--light-gray);
	}

	.main-menu-section {
		display: flex;
		align-items: center;
		gap: var(--gap);
	}
</style>
