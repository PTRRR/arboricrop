<script lang="ts">
	import { page } from '$app/stores';
	import Button from '../../../../components/Button.svelte';
	import Info from '../../../../components/Info.svelte';
	import Separation from '../../../../components/Separation.svelte';
	import Spacer from '../../../../components/Spacer.svelte';
	import Map from '../../../../components/wireframe/Map.svelte';
	import { useDevices, useFields } from '../../../../stores';
	import { getDevicesByFieldId } from '../../../../utils/dummyData';
	import type { Location } from '../../../../utils/types';

	const fields = useFields();
	const devices = useDevices();

	$: field = $fields.find((it) => it.id === $page.params.fieldId);
	$: fieldDevices = getDevicesByFieldId($devices, $page.params.fieldId);
	$: deviceLocations = fieldDevices.map((it) => it.location).filter((it) => it) as Location[];
</script>

{#if field}
	<Separation title="Map:" />
	<Map ratio={3} locations={deviceLocations} />
	<Spacer />

	<Separation title="Devices:" />
	{#each fieldDevices as device}
		{#if device}
			<Button minimal href={`/mobile-wireframe/devices/${device.id}`}>
				<div class="device">
					<span class="device-name">{device.name}</span>
					<span class="device-id">{device.status}</span>
				</div>
			</Button>
		{/if}
	{/each}
	<Spacer />

	<Separation title="Metadata:" />
	<Info label="Name:" value={field.name} />
	<Spacer />
	<Info label="Type:" value={field.type} />
	<Spacer />
	<Info label="Id:" value={field.id} />
	<Spacer />

	<Separation title="Metrics:" />
	<Button>Create metric</Button>
	<Spacer />

	<Separation title="Monitoring:" />
	<Button>Monitor metric</Button>
	<Spacer />

	<Separation title="Alarms:" />
	<Button>Create alarm</Button>
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
</style>
