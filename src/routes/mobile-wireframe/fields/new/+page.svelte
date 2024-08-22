<script lang="ts">
	import { goto } from '$app/navigation';
	import Spacer from '../../../../components/Spacer.svelte';
	import FieldForm from '../../../../components/wireframe/FieldForm.svelte';
	import Separation from '../../../../components/Separation.svelte';
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
>
	<Spacer size="var(--gap)" />
	<Separation />
	<Spacer size="0" />
</FieldForm>
