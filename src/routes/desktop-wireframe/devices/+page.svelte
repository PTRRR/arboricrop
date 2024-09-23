<script lang="ts">
	import { goto } from '$app/navigation';
	import List from '../../../components/List.svelte';
	import Section from '../../../components/wireframe/Section.svelte';
	import { useDevices } from '../../../stores';
	import { getCss } from '../../../utils/css';

	const devices = useDevices();
</script>

<Section title="Devices:">
	<List
		items={$devices}
		headers={{
			id: { size: '5rem', label: 'Id' },
			name: { size: '10rem', label: 'Name' },
			status: { size: '5rem', label: 'Status' }
		}}
		let:item
		let:headerStyles
		onSelect={(item) => goto(`/desktop-wireframe/devices/${item.id}`)}
	>
		<div class="device__info" style={headerStyles.id}>
			<span>{item.id}</span>
		</div>

		<div class="device__info" style={headerStyles.name}>
			<span>{item.name}</span>
		</div>

		<div class="device__info" style={headerStyles.status}>
			<span>{item.status}</span>
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
