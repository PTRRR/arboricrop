<script lang="ts">
	import { page } from '$app/stores';
	import DevicesList from '../../../../components/desktop/DevicesList.svelte';
	import Section from '../../../../components/desktop/Section.svelte';
	import Stack from '../../../../components/desktop/Stack.svelte';
	import Button from '../../../../components/layout/Button.svelte';
	import Table, { type Row, type Cell } from '../../../../components/layout/Table.svelte';
	import TextareaInput from '../../../../components/layout/TextareaInput.svelte';
	import TextInput from '../../../../components/layout/TextInput.svelte';
	import Checkbox from '../../../../components/mobile-layout/Checkbox.svelte';
	import PageHeader from '../../../../components/layout/PageHeader.svelte';
	import {
		useCurrentAccount,
		useDevices,
		useNotifications,
		useProjects,
		useTrials
	} from '../../../../stores';
	import type { Trial } from '../../../../utils/types';
	import TrialCard from '../../../../components/desktop/TrialCard.svelte';
	import Grid from '../../../../components/desktop/Grid.svelte';
	import Validation from '../../../../components/desktop/Validation.svelte';
	import { getCss } from '../../../../utils/css';
	import { shuffle } from '../../../../utils/arrays';
	import NotificationCard from '../../../../components/desktop/NotificationCard.svelte';
	import Dropdown from '../../../../components/desktop/Dropdown.svelte';

	const projectId = $page.params.id;
	const { projects, updateProject } = useProjects();
	const { devices } = useDevices();
	const { trials, updateTrials } = useTrials();
	const { currentAccount } = useCurrentAccount();
	const notifications = useNotifications();

	const randomNotifications = $derived(
		shuffle($notifications).slice(0, Math.floor(Math.random() * 5 + 2))
	);
	const project = $derived($projects.find((it) => it.id === projectId));
	const accountTrials = $derived(
		$trials.filter((it) => !it.parentId && it.accountId === $currentAccount?.id)
	);
	const projectTrials = $derived($trials.filter((it) => it.parentId === project?.id));
	const projectTrialsIds = $derived(projectTrials.map((it) => it.id));
	const projectDevices = $derived(
		$devices.filter(
			(it) => it.parentId && (it.parentId === project?.id || projectTrialsIds.includes(it.parentId))
		)
	);

	const getDevicesForTrial = $derived((trial: Trial) =>
		$devices.filter((it) => it.parentId === trial.id)
	);

	interface LoRaConfiguration {
		label: string;
	}

	const loraConfigurations: LoRaConfiguration[] = [
		{
			label: 'Europe'
		},
		{
			label: 'United States'
		},
		{
			label: 'Asia'
		}
	];

	let editingProject = $state(false);
	let editingTrials = $state(false);
	let selectedTrials = $state<Set<Trial>>(new Set());

	const editing = $derived(editingProject || editingTrials);
</script>

{#if project}
	{#snippet title()}
		<Stack
			direction="horizontal"
			alignItems="center"
			justifyContent="space-between"
			style={{ width: '100%' }}
		>
			{project.name}
			{#if !editing}
				<Button
					icon="navigate"
					iconOrder="inverted"
					onclick={() => (editingProject = !editingProject)}
				>
					Settings
				</Button>
			{/if}
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
			onclick={() => updateProject({ ...project, loraConfiguration: item.label })}
		>
			{item.label}
		</Button>
	{/snippet}

	<Stack direction="horizontal" style={{ width: '100%' }}>
		<Stack style={{ width: '100%' }}>
			<Section>
				<Stack gap="0.5rem">
					<PageHeader {title} subTitle={project.description} />
					<span style={getCss({ color: 'var(--black)' })}
						>LoRa Settings — {project.loraConfiguration || 'Europe'}</span
					>
				</Stack>
			</Section>

			<Section label="Notifications">
				<Grid>
					{#each randomNotifications as notification}
						<NotificationCard {notification} />
					{/each}
				</Grid>
			</Section>

			<Section
				label="Trials"
				actions={editing
					? []
					: [
							{
								label: 'Add',
								icon: 'add',
								iconOrder: 'inverted',
								onclick: () => (editingTrials = !editingTrials)
							}
						]}
			>
				{#if projectTrials.length === 0}
					<p>There are currently no trials for this prioject</p>
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

		{#if editingProject}
			<Section
				label="Settings"
				backgroundColor="var(--light-grey)"
				sticky="var(--content-offset-top)"
			>
				<TextInput label="Name" defaultValue={project.name} />
				<TextareaInput label="Description" defaultValue={project.description} />
				<Stack direction="horizontal">
					<Dropdown
						label={`LoRa Settings — ${project.loraConfiguration || 'Europe'}`}
						items={loraConfigurations}
						itemSnippet={dropdownItem}
					/>
				</Stack>
				<Validation
					onvalidate={() => (editingProject = false)}
					oncancel={() => {
						editingProject = false;
					}}
				/>
			</Section>
		{:else if editingTrials}
			<Section label="Trials" backgroundColor="var(--light-grey)">
				<Table
					headers={[
						{ label: '', width: '7%' },
						{ label: 'Name', width: '30%' },
						{ label: 'Devices', width: '30%' }
					]}
					rows={accountTrials.map((trial) => ({
						onclick: () => {
							if (selectedTrials.has(trial)) {
								selectedTrials.delete(trial);
							} else {
								selectedTrials.add(trial);
							}

							selectedTrials = new Set(selectedTrials);
						},
						selected: selectedTrials.has(trial),
						cells: [
							{ label: '', renderHandler: selectCell },
							{ label: trial.name },
							{ label: getDevicesForTrial(trial).length.toString() }
						]
					}))}
				/>
				<Validation
					onvalidate={() =>
						updateTrials(Array.from(selectedTrials).map((it) => ({ ...it, parentId: project.id })))}
					oncancel={() => {
						selectedTrials.clear();
						editingTrials = false;
					}}
				/>
			</Section>
		{/if}
	</Stack>
{/if}
