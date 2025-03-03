<script lang="ts">
	import { DropdownMenu } from 'bits-ui';
	import Button, { type ButtonIconOrder } from '../layout/Button.svelte';
	import type { Snippet } from 'svelte';
	import Stack from './Stack.svelte';
	import { type IconName } from '../mobile-layout/Icon.svelte';
	import { getCss } from '../../utils/css';

	type T = $$Generic;

	interface Props {
		label?: string | Snippet;
		side?: 'top' | 'bottom' | 'left' | 'right';
		sideOffset?: number;
		align?: 'left' | 'right' | 'center';
		sameWidth?: boolean;
		icon?: IconName;
		iconOrder?: ButtonIconOrder;
		items?: T[];
		itemSnippet?: Snippet<[item: T]>;
		small?: boolean;
		backgroundColor?: string;
		padding?: string | boolean;
	}

	const {
		label,
		side = 'bottom',
		sideOffset = 9,
		sameWidth = true,
		align = 'left',
		items = [],
		itemSnippet,
		icon,
		iconOrder,
		small,
		backgroundColor,
		padding
	}: Props = $props();
</script>

{#snippet labelSnippet()}
	{#if label}
		{#if typeof label === 'string'}
			{label}
		{:else}
			{@render label()}
		{/if}
	{/if}
{/snippet}

<DropdownMenu.Root>
	<DropdownMenu.Trigger asChild let:builder>
		{#if small}
			<Button
				{icon}
				{backgroundColor}
				{padding}
				iconSize="small"
				iconOrder={iconOrder || 'inverted'}
				fontSize="var(--main-font-size)"
				builders={[builder]}
			>
				<span style={getCss({ textDecoration: 'underline' })}>{@render labelSnippet()}</span>
			</Button>
		{:else}
			<Button {icon} {iconOrder} builders={[builder]} {padding} {backgroundColor}
				>{@render labelSnippet()}</Button
			>
		{/if}
	</DropdownMenu.Trigger>

	<DropdownMenu.Content {sideOffset} {side} {sameWidth}>
		<div
			class="dropdown__content"
			class:dropdown__content--align-left={align === 'left'}
			class:dropdown__content--align-right={align === 'right'}
			class:dropdown__content--align-center={align === 'center'}
		>
			<Stack>
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
