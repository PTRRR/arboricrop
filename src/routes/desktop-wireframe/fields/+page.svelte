<script lang="ts">
	import { createId } from '@paralleldrive/cuid2';
	import AlertDialog from '../../../components/AlertDialog.svelte';
	import Dialog from '../../../components/Dialog.svelte';
	import Info from '../../../components/Info.svelte';
	import Input from '../../../components/Input.svelte';
	import Spacer from '../../../components/Spacer.svelte';
	import Section from '../../../components/wireframe/Section.svelte';
	import { useDevices, useFields } from '../../../stores';
	import type { Field } from '../../../utils/types';
	import { changinCenter } from '../../../utils/dummyData';
	import { goto } from '$app/navigation';
	import List from '../../../components/List.svelte';

	const { fields, addField } = useFields();
	const { devices } = useDevices();

	$: getDevicesCount = (fieldId: string) => $devices.filter((it) => it.fieldId === fieldId).length;

	let newField: Field | undefined = undefined;
</script>

<Section
	title="Fields:"
	buttons={[
		{
			label: newField ? 'Cancel' : 'Create new field',
			onClick: () =>
				(newField = newField
					? undefined
					: { id: createId(), center: changinCenter, layers: [], name: '', type: '' })
		}
	]}
>
	<List
		items={$fields}
		headers={{
			name: { size: '10rem', label: 'Name' },
			devicesCount: { size: '10rem', label: 'Devices count' }
		}}
		let:item
		let:headerStyles
		onSelect={(item) => goto(`/desktop-wireframe/fields/${item.id}`)}
	>
		<div class="list__item" style={headerStyles.name}>{item.name || '-'}</div>
		<div class="list__item" style={headerStyles.devicesCount}>{getDevicesCount(item.id)}</div>
	</List>

	<AlertDialog
		open={!!newField}
		actionDisabled={!newField?.name || !newField?.type}
		actionLabel="Create"
		onAction={() => {
			if (newField) {
				addField(newField);
				goto(`/desktop-wireframe/fields/${newField.id}`);
			}
			newField = undefined;
		}}
		cancelLabel="Cancel"
		onCancel={() => (newField = undefined)}
	>
		<Dialog>
			<Section title="New field:">
				<Info label="Field name:" />
				<Spacer />
				<Input
					placeholder="Value..."
					onValue={(name) =>
						newField &&
						(newField = {
							...newField,
							name
						})}
				/>
				<Spacer />
				<Info label="Field type:" />
				<Spacer />
				<Input
					placeholder="Value..."
					onValue={(type) =>
						newField &&
						(newField = {
							...newField,
							type
						})}
				/>
			</Section>
		</Dialog>
	</AlertDialog>
</Section>
