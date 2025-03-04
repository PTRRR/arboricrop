<script lang="ts">
	import { page } from '$app/stores';
	import DevicesList from '../../../../components/desktop/DevicesList.svelte';
	import Section from '../../../../components/desktop/Section.svelte';
	import Stack from '../../../../components/desktop/Stack.svelte';
	import Button from '../../../../components/layout/Button.svelte';
	import { type Row, type Cell } from '../../../../components/layout/Table.svelte';
	import TextareaInput from '../../../../components/layout/TextareaInput.svelte';
	import TextInput from '../../../../components/layout/TextInput.svelte';
	import Checkbox from '../../../../components/mobile-layout/Checkbox.svelte';
	import PageHeader from '../../../../components/layout/PageHeader.svelte';
	import Map from '../../../../components/layout/Map.svelte';
	import {
		useCurrentAccount,
		useDevices,
		useNotifications,
		useProjects,
		useTrials
	} from '../../../../stores';
	import type { LoRaConfiguration, Trial } from '../../../../utils/types';
	import TrialCard from '../../../../components/desktop/TrialCard.svelte';
	import Grid from '../../../../components/desktop/Grid.svelte';
	import Validation from '../../../../components/desktop/Validation.svelte';
	import { shuffle } from '../../../../utils/arrays';
	import NotificationCard from '../../../../components/desktop/NotificationCard.svelte';
	import Dropdown from '../../../../components/desktop/Dropdown.svelte';
	import { changinCenter, loraConfigurations, swissBounds } from '../../../../utils/dummyData';
	import { createId } from '@paralleldrive/cuid2';
	import DangerZone from '../../../../components/desktop/DangerZone.svelte';
	import SearchBar from '../../../../components/desktop/SearchBar.svelte';
	import EmptyItem from '../../../../components/layout/EmptyItem.svelte';
	import PageLayout from '../../../../components/desktop/PageLayout.svelte';

	const projectId = $page.params.id;
	const { projects, updateProject } = useProjects();
	const { devices } = useDevices();
	const { trials, addTrial } = useTrials();
	const { currentAccount } = useCurrentAccount();
	const notifications = useNotifications();

	const randomNotifications = $derived(
		shuffle($notifications).slice(0, Math.floor(Math.random() * 5 + 2))
	);
	const project = $derived($projects.find((it) => it.id === projectId));
	const projectTrials = $derived($trials.filter((it) => it.parentId === project?.id));
	const projectTrialsIds = $derived(projectTrials.map((it) => it.id));
	const projectDevices = $derived(
		$devices.filter(
			(it) => it.parentId && (it.parentId === project?.id || projectTrialsIds.includes(it.parentId))
		)
	);

	let editingProject = $state(false);

	let map = $state<Map | undefined>(undefined);
	let newTrial = $state<Trial | undefined>(undefined);
	let selectedTrials = $state<Set<Trial>>(new Set());
	let newProjectName = $state('');

	const createTrial = $derived(() => {
		newTrial = {
			id: `tri-${createId()}`,
			name: '',
			area: '',
			center: changinCenter,
			layers: [],
			loraConfigId: '',
			type: '',
			parentId: project?.id,
			accountId: $currentAccount?.id || ''
		};
	});

	const showActionPanel = $derived(editingProject || newTrial);
	const actionPanelLabel = $derived(
		editingProject ? 'Edit Project' : newTrial ? 'New Trial' : undefined
	);
</script>

{#if project}
	{#snippet preTitle()}
		<Button icon="back" iconSize="small" href="/desktop-mvp/projects">Projects</Button>
	{/snippet}

	{#snippet title()}
		<Stack
			direction="horizontal"
			alignItems="center"
			justifyContent="space-between"
			style={{ width: '100%' }}
		>
			{project.name}

			<Button
				icon="edit"
				padding
				backgroundColor="var(--light-grey)"
				onclick={() => (editingProject = !editingProject)}>Edit</Button
			>
		</Stack>
	{/snippet}

	{#snippet selectCell(cell: Cell, row?: Row)}
		{#if row?.selected}
			<Checkbox initialChecked={true} raw />
		{:else}
			<Checkbox raw />
		{/if}
	{/snippet}

	{#snippet dropdownItem(item: LoRaConfiguration)}
		<Button
			backgroundColor="var(--white)"
			padding
			onclick={() =>
				updateProject({
					...project,
					loraConfiguration: {
						...(project.loraConfiguration || {}),
						name: item.name
					}
				})}
		>
			{item.name}
		</Button>
	{/snippet}

	{#snippet searchTrial()}
		<SearchBar />
	{/snippet}

	{#snippet actionPanel()}
		{#if editingProject}
			<TextInput label="Name" defaultValue={project.name} bind:value={newProjectName} />
			<TextareaInput label="Description" defaultValue={project.description} />

			<!-- <Stack gap="0.5rem">
          <span>Lora Settings</span>
          <Dropdown
            icon="navigate"
            label={project.loraConfiguration?.name || 'Europe'}
            items={loraConfigurations}
            itemSnippet={dropdownItem}
          />
        </Stack> -->

			<Validation
				validateLabel="Save"
				onvalidate={() => {
					updateProject({ ...project, name: newProjectName });
					editingProject = false;
				}}
				oncancel={() => {
					editingProject = false;
				}}
			/>

			<DangerZone
				label="Delete project"
				description="Permanently delete this project and all of its data. This action cannot be undone."
			/>
		{:else if newTrial}
			<TextInput
				label="Name"
				onvalue={(value) => {
					if (!newTrial) return;
					newTrial.name = value;
				}}
			/>
			<TextareaInput
				label="Description"
				onvalue={(value) => {
					if (!newTrial) return;
					newTrial.description = value;
				}}
			/>
			<Map
				bind:this={map}
				maxBounds={swissBounds}
				zoom={11}
				minZoom={3}
				maxZoom={18}
				center={newTrial.center}
				showTarget
				markers={[{ lngLat: newTrial.center }]}
				geoJSONs={newTrial.layers}
				onChange={() => {
					// const delta = getLocationDelta(value, newTrial.center);
					// if (delta > 0.000001) coords = value;
				}}
			/>
			<Validation
				validateLabel="Create"
				onvalidate={() => {
					if (!newTrial) return;
					addTrial(newTrial);
					newTrial = undefined;
				}}
				oncancel={() => {
					selectedTrials.clear();
					newTrial = undefined;
				}}
			/>
		{/if}
	{/snippet}

	<PageLayout label={actionPanelLabel} actionPanel={showActionPanel ? actionPanel : undefined}>
		<Stack style={{ width: '100%' }}>
			<Section>
				<Stack gap="0.5rem">
					<PageHeader {preTitle} {title} subTitle={project.description} />
					<!-- <span style={getCss({ color: 'var(--black)' })}
						>LoRa Settings — {project.loraConfiguration?.name || 'Europe'}</span
					> -->
				</Stack>
			</Section>

			{#if projectTrials.length > 0}
				<Section label="Notifications">
					<Grid>
						{#each randomNotifications as notification}
							<NotificationCard {notification} />
						{/each}
					</Grid>
				</Section>
			{/if}

			<Section
				label="Trials"
				actions={[
					{ label: searchTrial },
					{
						label: 'Create',
						icon: 'add',
						backgroundColor: 'var(--light-grey)',
						padding: true,
						onclick: () => createTrial()
					}
				]}
			>
				{#if projectTrials.length === 0}
					<EmptyItem label="There are currently no trials for this prioject" />
				{:else}
					<Grid>
						{#each projectTrials as trial}
							<TrialCard {trial} />
						{/each}
					</Grid>
				{/if}
			</Section>

			{#if projectDevices.length > 0}
				<Section label="Devices">
					<DevicesList devices={projectDevices} />
				</Section>
			{/if}
		</Stack>
	</PageLayout>
{/if}
