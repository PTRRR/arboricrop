<script lang="ts">
	import Spacer from '../../../components/Spacer.svelte';
	import Button from '../../../components/Button.svelte';
	import Card from '../../../components/wireframe/Card.svelte';
	import Separation from '../../../components/Separation.svelte';
	import { useDevices, useReturnButton } from '../../../stores';

	let devices = useDevices();
	let returnButton = useReturnButton();
	returnButton.set({
		label: 'Devices',
		href: '/mobile-wireframe/fields'
	});
</script>

<div class="devices">
	<div class="devices__pair-button">
		<Button href="/mobile-wireframe/devices/pairing">Pair device</Button>
		<Spacer size="var(--gap)"></Spacer>
	</div>

	<Separation title="Devices:" />

	<div class="devices__list">
		{#each $devices as device}
			<Card href={`/mobile-wireframe/devices/${device.id}`}>
				<h5 slot="title">{device.name}</h5>
				<span slot="subTitle">Battery: {device.battery}% - {device.status}</span>
			</Card>
		{/each}
	</div>
</div>

<style>
	.devices {
		display: flex;
		flex-direction: column;
		gap: var(--gap);
	}

	.devices__pair-button {
		position: sticky;
		top: var(--layout-vertical-padding);
		width: 100%;
		display: flex;
		flex-direction: column;
	}

	.devices__list {
		display: flex;
		flex-direction: column;
		gap: var(--gap);
	}
</style>
