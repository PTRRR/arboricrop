<script lang="ts">
	import Button from '../layout/Button.svelte';
	import type { Snippet } from 'svelte';
	import type { IconName } from './Icon.svelte';
	import { portal } from '../../utils/portal';
	import { LAYOUT_PORTAL } from '../../routes/mobile-layout/+layout.svelte';

	type T = $$Generic;

	const {
		label,
		items = [],
		renderItem,
		icon
	}: {
		label: string;
		side?: 'top' | 'bottom' | 'left' | 'right';
		sideOffset?: number;
		align?: 'left' | 'right' | 'center';
		sameWidth?: boolean;
		items: T[];
		renderItem: Snippet<[item: T]>;
		icon?: IconName;
	} = $props();

	let opened = $state(false);
</script>

<div class="dropdown">
	<Button {icon} onclick={() => (opened = !opened)}>{label}</Button>
	<div class="dropdown__portal" class:dropdown--opened={opened} use:portal={LAYOUT_PORTAL}>
		<div class="dropdown__overlay"></div>
		{#each items as item}
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div class="dropdown__item" onclick={() => (opened = false)}>
				{@render renderItem(item)}
			</div>
		{/each}
	</div>
</div>

<style lang="scss">
	.dropdown {
		$this: &;

		&__portal {
			position: absolute;
			z-index: 7;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			padding: 1.5rem;
			display: flex;
			justify-content: center;
			flex-direction: column;
			box-sizing: border-box;
			backdrop-filter: blur(10px);
			opacity: 0;
			pointer-events: none;
			gap: 0.5rem;
			transition: opacity 0.3s ease-in-out;

			&#{$this}--opened {
				opacity: 1;
				pointer-events: initial;
			}
		}

		&__overlay {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			background-color: var(--green);
		}

		&__item {
			position: relative;
			z-index: 5;
			color: var(--white);
		}
	}
</style>
