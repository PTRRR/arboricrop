<script>
	import Button from '../layout/Button.svelte';
	import TextInput from '../layout/TextInput.svelte';
	import Stack from './Stack.svelte';
</script>

<Stack gap="1rem" style={{ maxWidth: '30rem' }} direction="horizontal" alignItems="flex-end">
	<TextInput label="Search" style={{ width: '100%' }} />
	<Button icon="navigate">Submit</Button>
</Stack>
