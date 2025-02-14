<script lang="ts">
	import { createId } from '@paralleldrive/cuid2';
	import Section from '../../../components/desktop/Section.svelte';
	import Button from '../../../components/layout/Button.svelte';
	import PageHeader from '../../../components/layout/PageHeader.svelte';
	import { useCurrentAccount, useProjects } from '../../../stores';
	import type { LoRaConfiguration, Project } from '../../../utils/types';
	import Stack from '../../../components/desktop/Stack.svelte';
	import TextInput from '../../../components/layout/TextInput.svelte';
	import TextareaInput from '../../../components/layout/TextareaInput.svelte';
	import ProjectCard from '../../../components/desktop/ProjectCard.svelte';
	import Grid from '../../../components/desktop/Grid.svelte';
	import { onMount } from 'svelte';
	import { dummyProjects, loraConfigurations } from '../../../utils/dummyData';
	import { shuffle } from '../../../utils/arrays';
	import SearchBar from '../../../components/desktop/SearchBar.svelte';
	import Validation from '../../../components/desktop/Validation.svelte';
	import Dropdown from '../../../components/desktop/Dropdown.svelte';

	const { projects, addProject } = useProjects();
	const { currentAccount } = useCurrentAccount();
	const accountProjects = $derived($projects.filter((it) => it.accountId === $currentAccount?.id));

	let newProject = $state<Project | undefined>(undefined);

	const createProject = () => {
		if (!$currentAccount) return;
		newProject = {
			name: '',
			accountId: $currentAccount?.id,
			id: `proj-${createId()}`,
			description: '',
			loraConfiguration: {
				name: 'Europe'
			}
		};
	};

	onMount(() => {
		if ($currentAccount && accountProjects.length === 0) {
			const newProjects: Project[] = shuffle(dummyProjects)
				.slice(0, 10)
				.map((it) => ({
					id: `proj-${createId()}`,
					name: it.name,
					description: it.description,
					accountId: $currentAccount.id
				}));

			for (const project of newProjects) {
				addProject(project);
			}
		}
	});
</script>

{#snippet title()}
	<Stack
		direction="horizontal"
		style={{ width: '100%' }}
		alignItems="center"
		justifyContent="space-between"
	>
		Projects
		{#if !newProject}
			<Button icon="add" iconOrder="inverted" onclick={createProject}>Create</Button>
		{/if}
	</Stack>
{/snippet}

{#snippet dropdownItem(item: LoRaConfiguration)}
	<Button
		backgroundColor="var(--white)"
		padding
		onclick={() => {
			if (newProject) {
				newProject.loraConfiguration = item;
			}
		}}
	>
		{item.name}
	</Button>
{/snippet}

<Stack direction="horizontal" style={{ width: '100%' }} alignItems="flex-start">
	<Section>
		<PageHeader {title} subTitle={`${accountProjects.length} Projects`} />
		<SearchBar />
		<Grid>
			{#each accountProjects as project}
				<ProjectCard {project} />
			{/each}
		</Grid>
	</Section>

	{#if newProject}
		<Section
			label="New Project"
			backgroundColor="var(--light-grey)"
			sticky="var(--content-offset-top)"
			width="40%"
		>
			<TextInput
				label="Name"
				onvalue={(value) => {
					if (!newProject) return;
					newProject.name = value;
				}}
			/>
			<TextareaInput
				label="description"
				onvalue={(value) => {
					if (!newProject) return;
					newProject.description = value;
				}}
			/>
			<Stack gap="0.5rem">
				<span>Lora Settings</span>
				<Dropdown
					icon="navigate"
					label={newProject.loraConfiguration?.name || 'Europe'}
					items={loraConfigurations}
					itemSnippet={dropdownItem}
				/>
			</Stack>

			<Validation
				validateDisabled={!newProject.name}
				onvalidate={() => {
					newProject && addProject(newProject);
					newProject = undefined;
				}}
				oncancel={() => {
					newProject = undefined;
				}}
			/>
		</Section>
	{/if}
</Stack>
