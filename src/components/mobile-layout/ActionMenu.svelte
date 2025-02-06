<script module lang="ts">
	export const ACTION_MENU_PORTAL = 'action-menu';
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';
	import { portal } from '../../utils/portal';
	const { children }: { children?: Snippet } = $props();
</script>

<div class="action-menu" use:portal={ACTION_MENU_PORTAL}>
	{@render children?.()}
</div>

<style lang="scss">
	.action-menu {
		display: flex;
		gap: 1rem;
		padding: 0.5rem;
		border-radius: 5px;
	}
</style>
