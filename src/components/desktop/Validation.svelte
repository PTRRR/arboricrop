<script lang="ts">
	import Button from '../layout/Button.svelte';
	import type { IconName } from '../mobile-layout/Icon.svelte';
	import Stack from './Stack.svelte';

	interface Props {
		onvalidate?: () => void;
		oncancel?: () => void;
		validateDisabled?: boolean;
		validateLabel?: string | null;
		cancelDisabled?: boolean;
		cancelLabel?: string | null;
	}

	const {
		onvalidate,
		oncancel,
		validateLabel = 'Add',
		validateDisabled,
		cancelDisabled,
		cancelLabel = 'Cancel'
	}: Props = $props();
</script>

{#snippet button({
	label,
	disabled,
	onclick,
	icon,
	backgroundColor,
	iconColor,
	iconBackgroundColor
}: {
	label?: string | null;
	disabled?: boolean;
	onclick?: () => void;
	iconColor?: string;
	backgroundColor?: string;
	icon?: IconName;
	iconBackgroundColor?: string;
})}
	{#if label}
		<Button {icon} padding {backgroundColor} {iconColor} {iconBackgroundColor} {disabled} {onclick}
			>{label}</Button
		>
	{:else}
		<Button {icon} padding {backgroundColor} {iconColor} {iconBackgroundColor} {disabled} {onclick}
		></Button>
	{/if}
{/snippet}

<Stack direction="horizontal" gap="0.5rem">
	{#if onvalidate}
		{@render button({
			label: validateLabel,
			onclick: onvalidate,
			disabled: validateDisabled,
			iconColor: 'var(--light-green)',
			backgroundColor: 'var(--light-green)',
			icon: 'check'
		})}
	{/if}

	{#if oncancel}
		{@render button({
			label: cancelLabel,
			onclick: oncancel,
			disabled: cancelDisabled,
			iconColor: 'var(--black)',
			backgroundColor: 'var(--grey)',
			iconBackgroundColor: 'var(--dark-grey)',
			icon: 'cross'
		})}
	{/if}
</Stack>
