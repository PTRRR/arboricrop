<script lang="ts">
	import Spacer from '../../../components/Spacer.svelte';
	import Button from '../../../components/wireframe/Button.svelte';
	import Card from '../../../components/wireframe/Card.svelte';
	import { getDevices } from '../../../utils/devices';
</script>

<div class="devices">
	<div class="devices__pair-button">
		<Button href="/mobile-wireframe/devices/pairing">Pair device</Button>
		<Spacer size="1.5rem"></Spacer>
	</div>
	<div class="devices__list">
		{#each getDevices(30) as device}
			<Card href={`/mobile-wireframe/devices/${device.id}`}>
				<h5 slot="title">{device.name}</h5>
			</Card>
		{/each}
	</div>
</div>

<style>
	.devices__pair-button {
		position: sticky;
		top: 7rem;
		width: 100%;
		display: flex;
		flex-direction: column;
	}

	.devices__list {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
</style>
