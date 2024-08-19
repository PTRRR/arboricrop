<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import FieldForm from '../../../../components/wireframe/FieldForm.svelte';
	import { useFields, useReturnButton } from '../../../../stores';
	const fields = useFields();
	const returnButton = useReturnButton();

	$: field = $fields.find((it) => it.id === $page.params.fieldId);

	$: {
		if (field) {
			returnButton.set({
				label: field.name,
				href: '/mobile-wireframe/fields'
			});
		}
	}
</script>

<FieldForm
	{field}
	onSave={(field) => {
		const fieldIndex = $fields.findIndex((it) => it.id === field.id);

		if (fieldIndex > -1) {
			let newFields = [...$fields];
			newFields[fieldIndex] = field;
			fields.set(newFields);
		}

		goto('/mobile-wireframe/fields');
	}}
	onDelete={(id) => {
		fields.set($fields.filter((it) => it.id !== id));
		goto('/mobile-wireframe/fields');
	}}
/>
