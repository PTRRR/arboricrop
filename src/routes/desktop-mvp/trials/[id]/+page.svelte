<script lang="ts">
	import { page } from '$app/stores';
	import Section from '../../../../components/desktop/Section.svelte';
	import PageHeader from '../../../../components/mobile-layout/PageHeader.svelte';
	import Map from '../../../../components/layout/Map.svelte';
	import { useCurrentAccount, useDevices, useTrials } from '../../../../stores';
	import { swissBounds } from '../../../../utils/dummyData';
	import Stack from '../../../../components/desktop/Stack.svelte';
	import Pagination from '../../../../components/layout/Pagination.svelte';
	import type { Device } from '../../../../utils/types';
	import DevicesList from '../../../../components/desktop/DevicesList.svelte';
	import Validation from '../../../../components/desktop/Validation.svelte';

	const trialId = $page.params.id;
	const { trials } = useTrials();
	const { devices, updateDevices } = useDevices();
	const { currentAccount } = useCurrentAccount();

	const trial = $derived($trials.find((it) => it.id === trialId));
	const trialDevices = $derived($devices.filter((it) => it.parentId === trial?.id));
	const accountDevices = $derived(
		$devices.filter((it) => !it.parentId && it.accountId === $currentAccount?.id)
	);

	let map = $state<Map | undefined>(undefined);
	let selectedNewDevices = $state<Set<Device>>(new Set());
	let selectedDevices = $state<Set<Device>>(new Set());
	let addDevices = $state(false);
</script>

{#if trial}
	<Stack style={{ width: '100%' }} direction="horizontal">
		<Stack style={{ width: '100%' }}>
			<Section>
				<PageHeader title={trial.name} subTitle={`${trialDevices.length} Devices`} />
				<Map
					ratio={addDevices ? 2 : 3}
					bind:this={map}
					maxBounds={swissBounds}
					zoom={14}
					minZoom={3}
					maxZoom={18}
					center={trial.center}
					markers={[]}
					geoJSONs={trial.layers}
					onChange={(value) => {
						// const delta = getLocationDelta(value, newTrial.center);
						// if (delta > 0.000001) coords = value;
					}}
				/>
			</Section>

			<Section
				label="Devices"
				actions={addDevices
					? []
					: [
							{
								label: 'Add',
								icon: 'add',
								iconOrder: 'inverted',
								onclick: () => (addDevices = !addDevices)
							}
						]}
			>
				{#if trialDevices.length === 0}
					<p>There a no devices in this trial</p>
				{:else}
					<DevicesList
						devices={trialDevices}
						onselect={(devices) => (selectedDevices = new Set(devices))}
					/>
				{/if}
			</Section>
		</Stack>

		{#if addDevices}
			<Section label="Available devices" backgroundColor="var(--light-grey)" width="40%">
				<DevicesList
					devices={accountDevices.slice(0, 15)}
					onselect={(devices) => {
						selectedNewDevices = new Set(devices);
					}}
				/>
				<Pagination pages={3} />
				<Validation
					validateLabel="Add"
					validateDisabled={selectedNewDevices.size === 0}
					onvalidate={() => {
						updateDevices(
							Array.from(selectedNewDevices).map((it) => ({ ...it, parentId: trial.id }))
						);
					}}
					oncancel={() => {
						selectedNewDevices = new Set();
						selectedDevices = new Set();
						addDevices = false;
					}}
				/>
			</Section>
		{/if}
	</Stack>
{/if}
