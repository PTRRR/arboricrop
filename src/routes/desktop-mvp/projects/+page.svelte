<script lang="ts">
	import { createId } from '@paralleldrive/cuid2';
	import Section from '../../../components/desktop/Section.svelte';
	import Button from '../../../components/layout/Button.svelte';
	import PageHeader from '../../../components/mobile-layout/PageHeader.svelte';
	import { useCurrentAccount, useProjects } from '../../../stores';
	import type { Project } from '../../../utils/types';
	import Stack from '../../../components/desktop/Stack.svelte';
	import TextInput from '../../../components/layout/TextInput.svelte';
	import TextareaInput from '../../../components/layout/TextareaInput.svelte';
	import ProjectCard from '../../../components/desktop/ProjectCard.svelte';
	import Grid from '../../../components/desktop/Grid.svelte';
	import { onMount } from 'svelte';
	import { dummyProjects } from '../../../utils/dummyData';
	import { shuffle } from '../../../utils/arrays';
	import SearchBar from '../../../components/desktop/SearchBar.svelte';

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
			description: ''
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
		<Button icon="add" iconOrder="inverted" onclick={createProject}>Create</Button>
	</Stack>
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
		<Section label="New Project" backgroundColor="var(--light-grey)">
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

			<Stack gap="0.5rem" direction="horizontal">
				<Button icon="add" onclick={() => newProject && addProject(newProject)}>Create</Button>
				<Button icon="cross">Cancel</Button>
			</Stack>
		</Section>
	{/if}
</Stack>
