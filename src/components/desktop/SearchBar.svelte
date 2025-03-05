<script lang="ts">
	import Button from '../layout/Button.svelte';
	import TextInput from '../layout/TextInput.svelte';
	import Stack from './Stack.svelte';

	interface Props {
		value?: string;
		mode?: 'minimal' | 'normal';
		maxWidth?: string;
	}

	let { value = $bindable(), mode = 'normal', maxWidth = '13rem' }: Props = $props();
</script>

<Stack gap="0.5rem" style={{ maxWidth }} direction="horizontal" alignItems="flex-end">
	{#if mode === 'normal'}
		{#if typeof value !== 'undefined'}
			<TextInput placeholder="Search" style={{ width: '50%', flex: '1 1 auto' }} bind:value />
		{:else}
			<TextInput placeholder="Search" style={{ width: '50%', flex: '1 1 auto' }} />
		{/if}
	{/if}
	<Button icon="search" size="normal"></Button>
</Stack>
