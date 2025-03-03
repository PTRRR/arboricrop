<script lang="ts">
	import Button from '../layout/Button.svelte';
	import Stack from './Stack.svelte';

	interface Props {
		onvalidate?: () => void;
		oncancel?: () => void;
		validateDisabled?: boolean;
		validateLabel?: string;
		cancelDisabled?: boolean;
		cancelLabel?: string;
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

<Stack direction="horizontal" gap="1rem" style={{ marginTop: '3rem' }}>
	{#if onvalidate}
		<Button
			icon="check"
			padding
			backgroundColor="var(--light-green)"
			iconColor="var(--light-green)"
			disabled={validateDisabled}
			onclick={onvalidate}>{validateLabel}</Button
		>
	{/if}

	{#if oncancel}
		<Button
			icon="cross"
			padding
			backgroundColor="var(--white)"
			iconBackgroundColor="var(--grey)"
			iconColor="var(--black)"
			disabled={cancelDisabled}
			onclick={oncancel}>{cancelLabel}</Button
		>
	{/if}
</Stack>
