<script lang="ts">
	import { page } from '$app/stores';
	import Section from '../../../../components/desktop/Section.svelte';
	import PageHeader from '../../../../components/layout/PageHeader.svelte';
	import Map from '../../../../components/layout/Map.svelte';
	import {
		useCurrentAccount,
		useDevices,
		useGroups,
		useProjects,
		useTrials
	} from '../../../../stores';
	import { swissBounds } from '../../../../utils/dummyData';
	import Stack from '../../../../components/desktop/Stack.svelte';
	import Pagination from '../../../../components/layout/Pagination.svelte';
	import type { Device, Group } from '../../../../utils/types';
	import DevicesList from '../../../../components/desktop/DevicesList.svelte';
	import Validation from '../../../../components/desktop/Validation.svelte';
	import Table, { type Row } from '../../../../components/layout/Table.svelte';
	import type { LngLatLike } from 'svelte-maplibre';
	import { createId } from '@paralleldrive/cuid2';
	import TextInput from '../../../../components/layout/TextInput.svelte';
	import TextareaInput from '../../../../components/layout/TextareaInput.svelte';
	import Button from '../../../../components/layout/Button.svelte';
	import DangerZone from '../../../../components/desktop/DangerZone.svelte';
	import { goto } from '$app/navigation';
	import SearchBar from '../../../../components/desktop/SearchBar.svelte';
	import EmptyItem from '../../../../components/layout/EmptyItem.svelte';

	const trialId = $page.params.id;
	const { trials, deleteTrial } = useTrials();
	const { projects } = useProjects();
	const { groups, addGroup } = useGroups();
	const { devices, updateDevices } = useDevices();
	const { currentAccount } = useCurrentAccount();

	const trial = $derived($trials.find((it) => it.id === trialId));
	const project = $derived($projects.find((it) => it.id === trial?.parentId));
	const trialGroups = $derived($groups.filter((it) => it.parentId === trial?.id));
	const trialGroupsIds = $derived(trialGroups.map((it) => it.id));
	const trialDevices = $derived(
		$devices.filter((it) => it.parentId && trialGroupsIds.includes(it.parentId))
	);
	const accountDevices = $derived(
		$devices.filter((it) => !it.parentId && it.accountId === $currentAccount?.id)
	);

	let map = $state<Map | undefined>(undefined);
	let selectedNewDevices = $state<Set<Device>>(new Set());
	let selectedDevices = $state<Set<Device>>(new Set());
	let addDevices = $state(false);
	let newGroup = $state<Group | undefined>(undefined);
	let editTrial = $state(false);
	let selectedGroup = $state<Group | undefined>(undefined);

	const createGroup = $derived(() => {
		newGroup = {
			id: `gr-${createId()}`,
			name: '',
			description: '',
			deviceIds: [],
			parentId: trial?.id,
			accountId: $currentAccount?.id || ''
		};
	});

	const getGroupDevices = $derived((group: Group) => {
		const devices = trialDevices.filter((it) => it.parentId === group.id);
		return devices;
	});

	const groupsRows = $derived<Row[]>(
		trialGroups.map((it) => ({
			onclick: () => {
				if (selectedGroup?.id === it.id) {
					selectedGroup = undefined;
				} else {
					selectedGroup = it;
				}
			},
			selected: selectedGroup?.id === it.id,
			cells: [
				{ label: it.name },
				{ label: it.description || '-', multiline: true },
				{ label: getGroupDevices(it).length.toString() }
			]
		}))
	);

	const deviceMarkers = $derived(
		trialDevices.map((device) => ({
			lngLat: device.location as LngLatLike,
			label: device.name
		}))
	);
</script>

{#if trial}
	{#snippet preTitle()}
		<Button icon="back" iconSize="small" href={`/desktop-mvp/projects/${project?.id}`}
			>Projects/Trial</Button
		>
	{/snippet}

	{#snippet title()}
		<Stack
			direction="horizontal"
			alignItems="center"
			justifyContent="space-between"
			style={{ width: '100%' }}
		>
			{trial.name}
			{#if !editTrial && !selectedGroup && !newGroup}
				<Button
					icon="edit"
					padding
					backgroundColor="var(--light-grey)"
					onclick={() => (editTrial = !editTrial)}>Edit</Button
				>
			{/if}
		</Stack>
	{/snippet}

	{#snippet searchGroup()}
		<SearchBar />
	{/snippet}

	<Stack style={{ width: '100%' }} direction="horizontal">
		<Stack style={{ width: '100%' }}>
			<Section>
				<PageHeader {preTitle} {title} subTitle={`${trialDevices.length} Devices`} />
				<Map
					ratio={addDevices ? 2 : 3}
					bind:this={map}
					maxBounds={swissBounds}
					zoom={14}
					minZoom={3}
					maxZoom={18}
					center={trial.center}
					markers={deviceMarkers}
					geoJSONs={trial.layers}
					onChange={(value) => {
						// const delta = getLocationDelta(value, newTrial.center);
						// if (delta > 0.000001) coords = value;
					}}
				/>
			</Section>

			<Section
				label="Groups"
				actions={selectedGroup || newGroup || editTrial
					? []
					: [
							{ label: searchGroup },
							{
								label: 'Create',
								icon: 'add',
								backgroundColor: 'var(--light-grey)',
								padding: true,
								onclick: () => createGroup()
							}
						]}
			>
				{#if trialGroups.length > 0}
					<Table
						headers={[
							{ label: 'Name', width: '30%' },
							{ label: 'description', width: '30%' },
							{ label: 'Devices count' }
						]}
						rows={groupsRows}
					/>
				{:else}
					<EmptyItem label="There are no groups in this trial" />
				{/if}
			</Section>

			<Section label="Devices">
				{#if trialDevices.length === 0}
					<EmptyItem label="There are no devices in this trial" />
				{:else}
					<DevicesList devices={trialDevices} />
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
		{:else if editTrial}
			<Section
				label="Edit Trial"
				backgroundColor="var(--light-grey)"
				width="40%"
				sticky="var(--content-offset-top)"
			>
				<TextInput label="Name" defaultValue={trial.name} />
				<TextareaInput label="Description" defaultValue={trial.description} />
				<Map
					bind:this={map}
					maxBounds={swissBounds}
					zoom={11}
					minZoom={3}
					maxZoom={18}
					center={trial.center}
					showTarget
					markers={[{ lngLat: trial.center }]}
					geoJSONs={trial.layers}
					onChange={() => {
						// const delta = getLocationDelta(value, newTrial.center);
						// if (delta > 0.000001) coords = value;
					}}
				/>
				<Validation
					validateLabel="Save"
					onvalidate={() => {
						editTrial = false;
					}}
					oncancel={() => {
						editTrial = false;
					}}
				/>
				<DangerZone
					label="Delete trial"
					description="Permanently delete this trial and all of its data. This action cannot be undone."
					onclick={() => {
						const parentId = trial.parentId;
						deleteTrial(trial);
						goto(`/desktop-mvp/projects/${parentId}`);
					}}
				/>
			</Section>
		{:else if selectedGroup}
			<Section
				label="Edit group"
				backgroundColor="var(--light-grey)"
				width="40%"
				sticky="var(--content-offset-top)"
			>
				<TextInput label="Name" defaultValue={selectedGroup.name} />
				<TextareaInput label="Description" defaultValue={selectedGroup.description} />
				<Validation
					validateLabel="Save"
					onvalidate={() => {
						selectedGroup = undefined;
					}}
					oncancel={() => {
						selectedGroup = undefined;
					}}
				/>
				<DangerZone
					label="Delete group"
					description="Permanently delete this group and all of its data. This action cannot be undone."
				/>
			</Section>
		{:else if newGroup}
			<Section
				label="New Group"
				backgroundColor="var(--light-grey)"
				width="40%"
				sticky="var(--content-offset-top)"
			>
				<TextInput
					label="Name"
					onvalue={(value) => {
						if (!newGroup) return;
						newGroup.name = value;
					}}
				/>
				<TextareaInput
					label="Description"
					onvalue={(value) => {
						if (!newGroup) return;
						newGroup.description = value;
					}}
				/>
				<Validation
					validateLabel="Create"
					validateDisabled={!newGroup.name}
					onvalidate={() => {
						if (!newGroup) return;
						addGroup(newGroup);
						newGroup = undefined;
					}}
					oncancel={() => {
						selectedNewDevices = new Set();
						selectedDevices = new Set();
						addDevices = false;
						newGroup = undefined;
					}}
				/>
			</Section>
		{/if}
	</Stack>
{/if}
