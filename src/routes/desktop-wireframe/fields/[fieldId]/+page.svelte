<script lang="ts">
	import { page } from '$app/stores';
	import { useFields } from '../../../../stores';

	const fields = useFields();

	$: field = $fields.find((it) => it.id === $page.params.fieldId);
</script>

{#if field}
	<h1>Name: {field.name}</h1>
	<h1>Type: {field.type}</h1>
	<h1>Id: {field.id}</h1>
{/if}
