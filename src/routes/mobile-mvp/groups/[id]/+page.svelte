<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import Button from '../../../../components/layout/Button.svelte';
	import PageHeader from '../../../../components/layout/PageHeader.svelte';
	import Table, { type Cell } from '../../../../components/layout/Table.svelte';
	import Section from '../../../../components/mobile-layout/Section.svelte';
	import StatusDot from '../../../../components/mobile-layout/StatusDot.svelte';
	import { useDevices, useGroups, useReturnButton, useTrials } from '../../../../stores';
	import Map from '../../../../components/layout/Map.svelte';
	import type { PageData } from './$types';
	import { swissBounds } from '../../../../utils/dummyData';
	import type { LngLatLike } from 'svelte-maplibre';
	import ActionMenu from '../../../../components/mobile-layout/ActionMenu.svelte';
	import ActionButton from '../../../../components/mobile-layout/ActionButton.svelte';
	import Stack from '../../../../components/desktop/Stack.svelte';

	interface Prop {
		data: PageData;
	}

	const { data }: Prop = $props();
	const groupId = page.params.id;
	const { groups } = useGroups();
	const { trials } = useTrials();
	const { devices, updateDevice } = useDevices();
	const returnButton = useReturnButton();

	let map: Map | null = $state(null);
	const group = $derived($groups.find((it) => it.id === groupId));
	const trial = $derived($trials.find((it) => it.id === group?.parentId));
	const groupDevices = $derived($devices.filter((it) => it.parentId === group?.id));
	const deviceMarkers = $derived(
		groupDevices.map((device) => ({
			lngLat: device.location as LngLatLike,
			label: device.name
		}))
	);

	const devicesHeaders: Cell[] = [
		{ label: 'Name', width: '45%' },
		{ label: 'Status', width: '30%' },
		{ label: 'Battery', width: '20%' }
	];

	$effect(() => {
		returnButton.set({
			label: 'Trial',
			backHref: `${data.baseUrl}/trials/${trial?.id}`
		});
	});
</script>

{#if group}
	{#snippet statusCell(cell: Cell)}
		<Stack direction="horizontal" alignItems="center" gap="0.5rem">
			<StatusDot status={cell.label === 'active' ? 'success' : 'neutral'} />
			<span>{cell.label}</span>
		</Stack>
	{/snippet}

	<Section>
		<PageHeader preTitle="Group" title={group.name} subTitle={trial?.name} />
	</Section>

	<Section
		label="Devices"
		actions={groupDevices.length > 0
			? [
					{
						icon: 'add',
						label: 'Add',
						iconOrder: 'inverted',
						onclick: () => goto(`${data.baseUrl}/devices/pairing?group=${group.id}`)
					}
				]
			: []}
	>
		{#if groupDevices.length === 0}
			<Button href={`${data.baseUrl}/devices/pairing?group=${group.id}`} icon="add">
				Add device
			</Button>
		{:else}
			<Table
				headers={devicesHeaders}
				rows={groupDevices.map((it) => ({
					href: `${data.baseUrl}/devices/${it.id}`,
					cells: [
						{ label: it.name || it.id },
						{ label: it.status || '', renderHandler: statusCell },
						{ label: `${it.battery || '0'}%` }
					]
				}))}
			/>
		{/if}
	</Section>

	<Section label="Location">
		<Map
			bind:this={map}
			maxBounds={swissBounds}
			zoom={14}
			minZoom={3}
			maxZoom={18}
			center={trial?.center}
			geoJSONs={trial?.layers}
			markers={deviceMarkers}
			onChange={(value) => {
				// const delta = getLocationDelta(value, trial.center);
				// if (delta > 0.000001) coords = value;
			}}
		/>
	</Section>

	{#if groupDevices.length > 0}
		<ActionMenu>
			<ActionButton
				onclick={() => {
					const randomDeviceIndex = Math.floor(Math.random() * $devices.length);
					const device = $devices[randomDeviceIndex];
					goto(`${data.baseUrl}/devices/pairing?deviceId=${device?.id}`);
					updateDevice({
						...device,
						parentId: group.id
					});
				}}
			>
				pair device
			</ActionButton>
		</ActionMenu>
	{/if}
{/if}
