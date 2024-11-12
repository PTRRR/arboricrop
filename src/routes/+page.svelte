<div class="nav">
	<h1>Arboricrop UX/UI Designs</h1>

	<div class="links">
		<a href="/mobile-wireframe">Provisioning App Wireframe</a>
		<a href="/desktop-wireframe">Dashboard Wireframe</a>
		<a href="/map-system">Map System [research]</a>
	</div>
</div>

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
</style>
