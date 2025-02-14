<script lang="ts">
	import { onMount } from 'svelte';
	import Grid from '../../components/desktop/Grid.svelte';
	import ProjectCard from '../../components/desktop/ProjectCard.svelte';
	import Section from '../../components/desktop/Section.svelte';
	import Stack from '../../components/desktop/Stack.svelte';
	import TrialCard from '../../components/desktop/TrialCard.svelte';
	import PageHeader from '../../components/layout/PageHeader.svelte';
	import { useCurrentAccount, useNotifications, useProjects, useTrials } from '../../stores';
	import { shuffle } from '../../utils/arrays';
	import { changinCenter, dummyProjects, dummyTrials } from '../../utils/dummyData';
	import { createId } from '@paralleldrive/cuid2';
	import type { Project } from '../../utils/types';
	import NotificationCard from '../../components/desktop/NotificationCard.svelte';

	const { trials, addTrial } = useTrials();
	const { projects, addProject } = useProjects();
	const { currentAccount } = useCurrentAccount();
	const notifications = useNotifications();
	const randomNotifications = $derived(
		shuffle($notifications).slice(0, Math.floor(Math.random() * 5 + 4))
	);
	const accountTrials = $derived($trials.filter((it) => it.accountId === $currentAccount?.id));
	const accountProjects = $derived($projects.filter((it) => it.accountId === $currentAccount?.id));

	onMount(() => {
		if (accountTrials.length === 0) {
			shuffle(dummyTrials)
				.slice(0, 4)
				.forEach((trial) =>
					addTrial({
						...trial,
						id: `tri-${createId()}`,
						center: changinCenter,
						layers: [],
						loraConfigId: '',
						type: '',
						area: '',
						parentId: undefined,
						accountId: $currentAccount?.id || ''
					})
				);
		}

		onMount(() => {
			if ($currentAccount && accountProjects.length === 0) {
				const newProjects: Project[] = shuffle(dummyProjects)
					.slice(0, 5)
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
	});
</script>

<Stack style={{ width: '100%' }}>
	<Section>
		<PageHeader title="Dashboard" />
	</Section>

	<Section label="Notifications">
		<Grid>
			{#each randomNotifications as notification}
				<NotificationCard {notification} />
			{/each}
		</Grid>
	</Section>

	<Section
		label="Recent Projects"
		actions={[
			{ label: 'All', icon: 'navigate', iconOrder: 'inverted', href: '/desktop-mvp/projects' }
		]}
	>
		<Grid>
			{#each shuffle(accountProjects).slice(0, 6) as project}
				<ProjectCard {project} />
			{/each}
		</Grid>
	</Section>

	<Section
		label="Recent trials"
		actions={[
			{ label: 'All', icon: 'navigate', iconOrder: 'inverted', href: '/desktop-mvp/trials' }
		]}
	>
		<Grid>
			{#each shuffle(accountTrials).slice(0, 3) as trial}
				<TrialCard {trial} />
			{/each}
		</Grid>
	</Section>
</Stack>
