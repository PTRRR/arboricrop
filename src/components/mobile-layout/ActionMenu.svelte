<script lang="ts">
	import type { Snippet } from 'svelte';
	import { portal } from '../../utils/portal';
	import { useApp } from '../../stores';
	import { LAYOUT_PORTAL } from '../../routes/mobile-layout/+layout.svelte';
	const { children, hidden = $bindable(false) }: { children?: Snippet; hidden?: boolean } =
		$props();
	const { showAppMenu } = useApp();
</script>

<div
	class="action-menu"
	class:action-menu--hidden={$showAppMenu || hidden}
	use:portal={LAYOUT_PORTAL}
>
	{@render children?.()}
</div>

<style lang="scss">
	.action-menu {
		display: flex;
		gap: 1rem;
		padding: 0.5rem;
		border-radius: 5px;
		z-index: 15;
		position: absolute;
		bottom: 1.5rem;
		right: 1.5rem;
		transition:
			opacity 0.5s 0.3s ease-in-out,
			transform 0.7s cubic-bezier(0.83, 0, 0.17, 1);
		transform: translate(0, 0);

		&--hidden {
			opacity: 0;
			pointer-events: none;
			transform: translate(0, 150%);
			transition:
				opacity 0.5s ease-in-out,
				transform 0.7s cubic-bezier(0.83, 0, 0.17, 1);
		}
	}
</style>
