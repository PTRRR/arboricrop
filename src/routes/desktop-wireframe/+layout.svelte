<script lang="ts">
	import MainMenu from '../../components/dektop-wireframe/MainMenu.svelte';
</script>

<div class="layout">
	<MainMenu />
	<slot />
</div>

<style>
	.layout {
		min-height: 100svh;
		background-color: var(--light-gray);
	}
</style>
