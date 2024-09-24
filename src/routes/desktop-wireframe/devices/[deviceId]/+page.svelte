<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Button from '../../../../components/Button.svelte';
	import Info from '../../../../components/Info.svelte';
	import Input from '../../../../components/Input.svelte';
	import MapV2 from '../../../../components/MapV2.svelte';
	import Spacer from '../../../../components/Spacer.svelte';
	import Section from '../../../../components/wireframe/Section.svelte';
	import { useDevices, useFields } from '../../../../stores';

	const devices = useDevices();
	const { fields, getFieldById } = useFields();

	$: device = $devices.find((it) => it.id === $page.params.deviceId);
	$: field = $fields && device?.fieldId ? getFieldById(device.fieldId) : undefined;

	let editMetadata: boolean = false;
</script>

{#if device}
	<Section
		title="Metadata:"
		buttons={[
			{
				label: editMetadata ? 'Cancel' : 'Edit',
				onClick: () => (editMetadata = !editMetadata)
			}
		]}
	>
		<Info label="Id:" value={device.id} />
		<Spacer />
		{#if editMetadata}
			<Info label="Name:" />
			<Spacer />
			<Input value={device.name} />
		{:else}
			<Info label="Name:" value={device.name} />
			<Spacer />
			<Info label="Status:" value={device.status} />
			<Spacer />
			<Info label="Field:" value={field?.name || '-'} />
		{/if}
		{#if editMetadata}
			<Spacer />
			<Button
				on:click={() => {
					goto('/desktop-wireframe/devices');
					devices.set($devices.filter((it) => it.id !== device.id));
				}}
			>
				Permanently delete device
			</Button>
		{/if}
	</Section>

	{#if device?.location}
		<Section title="Location:">
			<MapV2
				ratio={3}
				zoom={15.5}
				minZoom={10}
				maxZoom={19}
				center={device.location}
				markers={[{ lngLat: device.location }]}
				geoJSONs={field?.layers}
				interactive={false}
			/>
		</Section>
	{/if}
{/if}
