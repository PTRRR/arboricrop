<script>
	import Button from '../Button.svelte';
</script>

<div class="main-menu">
	<span>Arboricrop</span>
	<div class="main-menu-section main-menu__right-section">
		<Button>Settings</Button>
		<Button>Profile</Button>
	</div>
</div>

<style>
	.main-menu {
		display: flex;
		position: sticky;
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
