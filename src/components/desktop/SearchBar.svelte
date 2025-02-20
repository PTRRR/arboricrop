<script lang="ts">
	import Button from '../layout/Button.svelte';
	import TextInput from '../layout/TextInput.svelte';
	import Stack from './Stack.svelte';

	interface Props {
		value?: string;
	}

	let { value = $bindable() }: Props = $props();
</script>

<Stack gap="1rem" style={{ maxWidth: '30rem' }} direction="horizontal" alignItems="flex-end">
	{#if typeof value !== 'undefined'}
		<TextInput label="Search" style={{ width: '100%' }} bind:value />
	{:else}
		<TextInput label="Search" style={{ width: '100%' }} />
	{/if}
	<Button icon="navigate">Submit</Button>
</Stack>
