<script>
	import { goto } from '$app/navigation';
</script>

<div class="nav">
	<h1>Arboricrop UX/UI Designs</h1>

	<div class="links">
		<a href="/mobile-wireframe">Provisioning App Wireframe</a>
		<a href="/mobile-layout">Provisioning App Layout</a>
		<a href="/desktop-wireframe">Dashboard Wireframe</a>
		<a href="/desktop-mvp">Dashboard MVP</a>
		<a href="/mobile-mvp">Mobile MVP</a>
		<a href="/map-system">Map System [research]</a>
	</div>
</div>

<button
	class="clear-local-storage"
	onclick={async () => {
		if (typeof Storage !== 'undefined') {
			// Reload the page
			await goto('/');
			localStorage.clear();
			window.location.reload();
		} else {
			console.log('localStorage is not supported in this browser');
		}
	}}
>
	Reset DB
</button>

<svelte:head>
	<title>Arboricrop UX/UI Design</title>
</svelte:head>

<style>
	.nav {
		width: 100%;
		height: 100svh;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		gap: 2rem;
	}

	.links {
		display: flex;
		flex-direction: column;
		text-align: center;
	}

	a {
		font-size: 1.5rem;
		color: black;
	}

	a + a {
		margin-top: 0.5rem;
	}

	.clear-local-storage {
		position: fixed;
		bottom: 1rem;
		right: 1rem;
	}
</style>
