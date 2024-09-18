<script lang="ts">
	import Card from '../../../components/wireframe/Card.svelte';
	import { useDevices, useReturnButton } from '../../../stores';
	import Section from '../../../components/wireframe/Section.svelte';

	let devices = useDevices();
	let returnButton = useReturnButton();
	returnButton.set({
		label: 'Devices',
		href: '/mobile-wireframe/fields'
	});
</script>

<div class="devices">
	<Section
		title="Devices:"
		buttons={[{ label: 'Pair device', href: '/mobile-wireframe/devices/pairing' }]}
	>
		<div class="devices__list">
			{#each $devices as device}
				<Card href={`/mobile-wireframe/devices/${device.id}`}>
					<h5 slot="title">{device.name}</h5>
					<span slot="subTitle">Battery: {device.battery}% - {device.status}</span>
				</Card>
			{/each}
		</div>
	</Section>
</div>

<style>
	.devices {
		display: flex;
		flex-direction: column;
		gap: var(--gap);
	}

	.devices__list {
		display: flex;
		flex-direction: column;
		gap: var(--gap);
	}
</style>
