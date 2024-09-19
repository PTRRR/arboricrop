<script lang="ts">
	import { page } from '$app/stores';
	import Button from '../../../../components/Button.svelte';
	import Info from '../../../../components/Info.svelte';
	import Spacer from '../../../../components/Spacer.svelte';
	import { useDevices, useFields } from '../../../../stores';
	import { getDevicesByFieldId } from '../../../../utils/dummyData';
	import MapV2 from '../../../../components/MapV2.svelte';
	import type { LngLatLike } from 'svelte-maplibre';
	import Section from '../../../../components/wireframe/Section.svelte';

	const fields = useFields();
	const devices = useDevices();

	$: field = $fields.find((it) => it.id === $page.params.fieldId);
	$: fieldDevices = getDevicesByFieldId($devices, $page.params.fieldId);
	$: deviceLocations = fieldDevices.map((it) => it.location).filter((it) => it) as LngLatLike[];
</script>

{#if field}
	<Section title="Metadata:" buttons={[{ label: 'Edit' }]}>
		<Info label="Name:" value={field.name} />
		<Spacer />
		<Info label="Type:" value={field.type} />
		<Spacer />
		<Info label="Id:" value={field.id} />
	</Section>

	<Section title="Map:">
		<MapV2
			ratio={3}
			center={field.center}
			zoom={15}
			geoJSONs={field.layers}
			markers={deviceLocations.map((it) => ({ lngLat: it }))}
		/>
		<Spacer />
		<Info label="Metrics filters:" />
		<Spacer />
		<div class="filters">
			<Button>Water</Button>
			<Button>Light</Button>
			<Button>Temperature</Button>
			<Button>Humidity</Button>
			<Button>Soil pH</Button>
		</div>
	</Section>

	<Section title="Layers" buttons={[{ label: 'Add layer' }]}>
		<span>No layers</span>
	</Section>

	<Section title="Devices:" buttons={[{ label: 'See devices' }]}>
		{#each fieldDevices as device}
			{#if device}
				<Button minimal href={`/desktop-wireframe/devices/${device.id}`}>
					<div class="device">
						<span class="device-name">{device.name}</span>
						<span class="device-id">{device.status}</span>
					</div>
				</Button>
			{/if}
		{/each}
	</Section>

	<Section title="Metrics:" buttons={[{ label: 'Add metric' }]}>
		<span>No metrics</span>
	</Section>

	<Section title="Monitoring:" buttons={[{ label: 'Add metric monitor' }]}>
		<span>No metric monitors</span>
	</Section>

	<Section title="Alarms:" buttons={[{ label: 'Create alarm' }]}>
		<span>No alarms</span>
	</Section>
{/if}

<style>
	.device {
		display: flex;
		max-width: 100%;
		justify-content: space-between;
	}

	.device-name {
		flex: 0 0 auto;
		width: 30%;
		text-align: left;
	}

	.device-id {
		overflow: hidden;
		text-overflow: ellipsis;
		flex: 1 1 auto;
		white-space: nowrap;
		text-align: right;
	}

	.device {
		display: flex;
		justify-content: space-between;
		width: 100%;
	}

	.filters {
		display: flex;
		gap: 1rem;
		align-items: center;
	}
</style>
