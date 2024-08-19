<script lang="ts">
	import { goto } from '$app/navigation';
	import FieldForm from '../../../../components/wireframe/FieldForm.svelte';
	import { useFields, useReturnButton } from '../../../../stores';

	const fields = useFields();
	const returnButton = useReturnButton();
	returnButton.set({
		label: `New field`,
		href: '/mobile-wireframe/fields'
	});
</script>

<FieldForm
	onSave={(field) => {
		fields.set([...$fields, field]);
		goto(`/mobile-wireframe/fields/${field.id}`);
	}}
	onCancel={() => goto('/mobile-wireframe/fields')}
/>
