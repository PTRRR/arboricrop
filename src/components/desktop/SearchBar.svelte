<script>
	import Button from '../layout/Button.svelte';
	import TextInput from '../layout/TextInput.svelte';
	import Stack from './Stack.svelte';
</script>

<Stack gap="0.5rem" style={{ maxWidth: '30rem' }}>
	<TextInput label="Search" />
	<Button icon="navigate">Submit</Button>
</Stack>
