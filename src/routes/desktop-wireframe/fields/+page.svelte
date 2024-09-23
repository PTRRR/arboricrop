<script lang="ts">
	import { createId } from '@paralleldrive/cuid2';
	import AlertDialog from '../../../components/AlertDialog.svelte';
	import Dialog from '../../../components/Dialog.svelte';
	import Info from '../../../components/Info.svelte';
	import Input from '../../../components/Input.svelte';
	import Spacer from '../../../components/Spacer.svelte';
	import ButtonList from '../../../components/wireframe/ButtonList.svelte';
	import Section from '../../../components/wireframe/Section.svelte';
	import { useFields } from '../../../stores';
	import type { Field } from '../../../utils/types';
	import { changinCenter } from '../../../utils/dummyData';
	import { goto } from '$app/navigation';

	const { fields, addField } = useFields();

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
	<ButtonList
		items={$fields}
		let:item
		onSelect={(field) => goto(`/desktop-wireframe/fields/${field.id}`)}
	>
		{item.name}
	</ButtonList>

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
