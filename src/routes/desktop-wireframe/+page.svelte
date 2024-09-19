<script lang="ts">
	import Button from '../../components/Button.svelte';
	import Separation from '../../components/Separation.svelte';
	import Spacer from '../../components/Spacer.svelte';
	import Image from '../../components/wireframe/Image.svelte';
	import { useDevices, useFields } from '../../stores';
	import AlertDialog from '../../components/AlertDialog.svelte';
	import Input from '../../components/Input.svelte';
	import { createId } from '@paralleldrive/cuid2';
	import { changinCenter } from '../../utils/dummyData';
	import MapV2 from '../../components/MapV2.svelte';

	const fields = useFields();
	const devices = useDevices();

	$: getFieldDeviceCount = (fieldId: string) => {
		return $devices.filter((it) => it.fieldId === fieldId).length;
	};

	let newFieldName: string | undefined = undefined;
	let newFieldType: string | undefined = undefined;
</script>

<Separation title="Analysis Feed:" />

<Separation title="Fields:" />
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
					type: newFieldType,
					layers: [],
					center: changinCenter
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
<Spacer />
<div class="dashboard">
	{#each $fields as field}
		<div class="dashboard__item">
			<MapV2 ratio={1.5} center={field.center} zoom={15} interactive={false} />
			<!-- <Image ratio={0.1} placeholder={`Infographic: ${field.name}`} /> -->
			<Spacer />
			<span>Devices count: {getFieldDeviceCount(field.id)}</span>
			<Button minimal href={`/desktop-wireframe/fields/${field.id}`}>See field</Button>
		</div>
	{/each}
</div>

<style>
	.dashboard {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: var(--gap);
	}

	.dashboard__item {
		height: 30svh;
		display: flex;
		flex-direction: column;
		align-items: flex-end;
	}

	.dashboard__new-field {
		display: flex;
		flex-direction: column;
		min-width: 30rem;
		gap: var(--gap);
	}
</style>
