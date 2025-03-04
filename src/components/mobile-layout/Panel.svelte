<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		children: Snippet;
		state: 'mount' | 'mounting' | 'unmounting';
	}

	const { state, children }: Props = $props();
</script>

<div
	class="panel"
	class:panel--mount={state === 'mount'}
	class:panel--mounting={state === 'mounting'}
	class:panel--unmounting={state === 'unmounting'}
>
	{@render children()}
</div>

<style lang="scss">
	.panel {
		position: fixed;
		bottom: 0;
		left: 0;
		z-index: 10;
		background-color: white;
		width: 100%;
		padding: 2rem 1.5rem 5rem 1.5rem;
		box-sizing: border-box;
		border-radius: 1.5rem;
		transition:
			opacity 0.5s cubic-bezier(0.83, 0, 0.17, 1),
			transform 0.5s cubic-bezier(0.83, 0, 0.17, 1);

		&--mount,
		&--unmounting {
			transform: translate(0, 100%) !important;
		}

		&--mounting {
			transition:
				opacity 0.5s 0.1s cubic-bezier(0.83, 0, 0.17, 1),
				transform 0.5s 0.1s cubic-bezier(0.83, 0, 0.17, 1);
			transform: translate(0, 0);
			opacity: 1;
		}
	}
</style>
