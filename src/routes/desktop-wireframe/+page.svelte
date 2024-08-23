<script lang="ts">
	import Button from '../../components/Button.svelte';
	import Separation from '../../components/Separation.svelte';
	import Spacer from '../../components/Spacer.svelte';
	import Image from '../../components/wireframe/Image.svelte';
	import { useFields } from '../../stores';
	import { goto } from '$app/navigation';
	import AlertDialog from '../../components/AlertDialog.svelte';
	import Input from '../../components/Input.svelte';
	import { createId } from '@paralleldrive/cuid2';

	const fields = useFields();

	let newFieldName: string | undefined = undefined;
	let newFieldType: string | undefined = undefined;
</script>

<Separation title="Fields:" />
<div class="dashboard">
	{#each $fields as field}
		<div class="dashboard__item">
			<Image
				ratio={0.1}
				placeholder={`Infographic: ${field.name}`}
				onClick={() => goto(`/desktop-wireframe/fields/${field.id}`)}
			/>
		</div>
	{/each}
</div>
<Spacer />
<AlertDialog
	triggerLabel="Create new field"
	cancelLabel="Cancel"
	actionLabel="Create"
	onCancel={() => {
		newFieldName = undefined;
		newFieldType = undefined;
	}}
	onAction={() => {
		if (newFieldName && newFieldType) {
			fields.set([
				...$fields,
				{
					id: `fie-${createId()}`,
					name: newFieldName,
					type: newFieldType
				}
			]);
		}

		newFieldName = undefined;
		newFieldType = undefined;
	}}
>
	<div class="dashboard__new-field">
		<Separation title="New field:" />
		<Input placeholder="Field name" onValue={(value) => (newFieldName = value)} />
		<Input placeholder="Field type" onValue={(value) => (newFieldType = value)} />
	</div>
</AlertDialog>

<style>
	.dashboard {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: var(--gap);
	}

	.dashboard__item {
		height: 30svh;
	}

	.dashboard__new-field {
		display: flex;
		flex-direction: column;
		min-width: 30rem;
		gap: var(--gap);
	}
</style>
