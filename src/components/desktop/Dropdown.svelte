<script lang="ts">
	import { DropdownMenu } from 'bits-ui';
	import Button from '../layout/Button.svelte';
	import type { Snippet } from 'svelte';
	import Stack from './Stack.svelte';
	import { type IconName } from '../mobile-layout/Icon.svelte';

	type T = $$Generic;

	interface Props {
		label: String;
		side?: 'top' | 'bottom' | 'left' | 'right';
		sideOffset?: number;
		align?: 'left' | 'right' | 'center';
		sameWidth?: boolean;
		icon?: IconName;
		items?: T[];
		itemSnippet?: Snippet<[item: T]>;
	}

	const {
		label,
		side = 'bottom',
		sideOffset = 9,
		sameWidth = true,
		align = 'left',
		items = [],
		itemSnippet,
		icon
	}: Props = $props();
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger asChild let:builder>
		<Button {icon} builders={[builder]}>{label}</Button>
	</DropdownMenu.Trigger>

	<DropdownMenu.Content {sideOffset} {side} {sameWidth}>
		<div
			class="dropdown__content"
			class:dropdown__content--align-left={align === 'left'}
			class:dropdown__content--align-right={align === 'right'}
			class:dropdown__content--align-center={align === 'center'}
		>
			<Stack gap="0.5rem">
				{#each items as item}
					<DropdownMenu.Item>
						{#if itemSnippet}
							{@render itemSnippet(item)}
						{/if}
					</DropdownMenu.Item>
				{/each}
			</Stack>
		</div>
	</DropdownMenu.Content>
</DropdownMenu.Root>

<style lang="scss">
	.dropdown {
		&__content {
			background-color: var(--light-grey);
			padding: 0.8rem;
			border-radius: 1rem;
			font-family: Rubik;
		}
	}
</style>
