<script lang="ts">
	import { goto } from '$app/navigation';
	import List from '../../../components/List.svelte';
	import Section from '../../../components/wireframe/Section.svelte';
	import { useDevices, useFields } from '../../../stores';

	const devices = useDevices();
	const { getFieldById } = useFields();
</script>

<Section title="Devices:">
	<List
		items={$devices}
		headers={{
			name: { size: '7rem', label: 'Name' },
			status: { size: '6rem', label: 'Status' },
			field: { size: '10rem', label: 'Field' },
			id: { size: '15rem', label: 'Id' }
		}}
		let:item
		let:headerStyles
		onSelect={(item) => goto(`/desktop-wireframe/devices/${item.id}`)}
	>
		<div class="device__info" style={headerStyles.name}>
			<span>{item.name}</span>
		</div>

		<div class="device__info" style={headerStyles.status}>
			<span>{item.status}</span>
		</div>

		<div class="device__info" style={headerStyles.field}>
			<span>{getFieldById(item.fieldId || '')?.name || '-'}</span>
		</div>

		<div class="device__info" style={headerStyles.id}>
			<span>{item.id}</span>
		</div>
	</List>
</Section>

<style>
	.device__info {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
</style>
