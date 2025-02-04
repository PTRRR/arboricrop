<script lang="ts">
	import { page } from '$app/stores';
	import Button from '../../../../components/mobile-layout/Button.svelte';
	import Section from '../../../../components/mobile-layout/Section.svelte';
	import Map from '../../../../components/mobile-layout/Map.svelte';
	import { useDevices, useFields, useLoRaConfigurations } from '../../../../stores';
	import { swissBounds } from '../../../../utils/dummyData';

	const fieldId = $page.params.fieldId;
	const { devices } = useDevices();
	const { fields, getFieldById, deleteField } = useFields();
	const { loRaConfigurations } = useLoRaConfigurations();
	const defaultLoRaConfiguration = $derived($loRaConfigurations.find((it) => it.isDefault));

	let map: Map | null = $state(null);

	const field = $derived($fields && getFieldById(fieldId));
	const fieldDevices = $derived($devices.filter((it) => it.fieldId === field?.id));
</script>

{#if field}
	<Section label="1: General Settings">
		<span>{field.name}</span>
	</Section>
	<Section label="2: Devices">
		{#each $devices as device}
			<a href={`/mobile-layout/devices/${device.id}`}>{device.name || device.id}</a>
		{/each}
		<Button href={`/mobile-layout/devices/pairing?field=${field.id}`}>Add device</Button>
	</Section>
	<Section label="3: Location">
		<Map
			bind:this={map}
			maxBounds={swissBounds}
			zoom={9}
			minZoom={3}
			maxZoom={18}
			center={field.center}
			showTarget
			markers={[{ lngLat: field.center }]}
			geoJSONs={[]}
		/>
	</Section>
	<Section label="4: Layers"></Section>
	<Section label="5: LoRa"></Section>
	<Section label="6: Danger Zone">
		<Button>Delete Permanently</Button>
	</Section>
{/if}
