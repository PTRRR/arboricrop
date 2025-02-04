<script lang="ts">
	import type { Snippet } from 'svelte';

	const props: { children: Snippet } = $props();
</script>

<div class="centered-wrapper">
	{@render props.children()}
</div>

<style lang="scss">
	.centered-wrapper {
		position: relative;
		display: flex;
		flex-direction: column;
		justify-content: center;
		min-height: calc(
			var(--mobile-app-height) - var(--layout-margin-top) - var(--big-font-size) - 4rem
		);
	}
</style>
