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
		cancelLabel = 'Cancal'
	}: Props = $props();
</script>

<Stack direction="horizontal" gap="1rem">
	{#if onvalidate}
		<Button icon="check" disabled={validateDisabled} onclick={onvalidate}>{validateLabel}</Button>
	{/if}

	{#if oncancel}
		<Button icon="cross" disabled={cancelDisabled} onclick={oncancel}>{cancelLabel}</Button>
	{/if}
</Stack>
