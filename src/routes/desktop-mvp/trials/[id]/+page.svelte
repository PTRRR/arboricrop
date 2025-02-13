<script lang="ts">
	import { page } from '$app/stores';
	import Section from '../../../../components/desktop/Section.svelte';
	import PageHeader from '../../../../components/mobile-layout/PageHeader.svelte';
	import Map from '../../../../components/layout/Map.svelte';
	import { useCurrentAccount, useDevices, useTrials } from '../../../../stores';
	import { swissBounds } from '../../../../utils/dummyData';
	import Stack from '../../../../components/desktop/Stack.svelte';
	import Button from '../../../../components/layout/Button.svelte';
	import Pagination from '../../../../components/layout/Pagination.svelte';
	import type { Device } from '../../../../utils/types';
	import DevicesList from '../../../../components/desktop/DevicesList.svelte';

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
</script>

{#if trial}
	<Stack style={{ width: '100%' }} direction="horizontal">
		<Section>
			<PageHeader title={trial.name} subTitle={`${trialDevices.length} Devices`} />
			<Map
				ratio={2}
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

			<DevicesList
				devices={trialDevices}
				onselect={(devices) => (selectedDevices = new Set(devices))}
			/>

			<Stack direction="horizontal">
				<Button
					icon="cross"
					backgroundColor="var(--grey)"
					padding
					disabled={selectedDevices.size === 0}
					onclick={() =>
						updateDevices(
							Array.from(selectedDevices).map((it) => ({ ...it, parentId: undefined }))
						)}
				>
					Remove
				</Button>
			</Stack>
		</Section>

		<Section label="Available devices" backgroundColor="var(--light-grey)" width="40%">
			<DevicesList
				devices={accountDevices}
				onselect={(devices) => (selectedNewDevices = new Set(devices))}
			/>

			<Pagination pages={3} />

			<Stack gap="0.5rem" direction="horizontal">
				<Button
					icon="check"
					backgroundColor="var(--light-green)"
					iconBackgroundColor="var(--green)"
					padding
					disabled={selectedNewDevices.size === 0}
					onclick={() => {
						updateDevices(
							Array.from(selectedNewDevices).map((it) => ({ ...it, parentId: trial.id }))
						);
					}}
				>
					Add
				</Button>
				<Button icon="cross" backgroundColor="var(--grey)" padding>Close</Button>
			</Stack>
		</Section>
	</Stack>
{/if}
