<script lang="ts">
	import type { Snippet } from 'svelte';
	import Stack from './Stack.svelte';

	interface Props {
		label?: string;
		children?: Snippet;
	}

	const { label, children }: Props = $props();
</script>

<Stack
	direction="horizontal"
	alignItems="center"
	style={{ width: '100%' }}
	justifyContent="space-between"
	gap="1rem"
>
	{#if label}
		<span>{label}</span>
	{/if}

	{#if children}
		<Stack direction="horizontal" gap="0.5rem" alignItems="center">
			{@render children()}
		</Stack>
	{/if}
</Stack>
