<script lang="ts">
	import { onMount } from 'svelte';
	import Grid from '../../components/desktop/Grid.svelte';
	import ProjectCard from '../../components/desktop/ProjectCard.svelte';
	import Section from '../../components/desktop/Section.svelte';
	import Stack from '../../components/desktop/Stack.svelte';
	import TrialCard from '../../components/desktop/TrialCard.svelte';
	import PageHeader from '../../components/layout/PageHeader.svelte';
	import {
		useCurrentAccount,
		useGroups,
		useNotifications,
		useProjects,
		useTrials
	} from '../../stores';
	import { shuffle } from '../../utils/arrays';
	import { changinCenter, dummyGroups, dummyProjects, dummyTrials } from '../../utils/dummyData';
	import { createId } from '@paralleldrive/cuid2';
	import type { Group, Project } from '../../utils/types';
	import NotificationCard from '../../components/desktop/NotificationCard.svelte';
	import Button from '../../components/layout/Button.svelte';

	const { trials, addTrial } = useTrials();
	const { projects, addProject } = useProjects();
	const { groups, addGroup } = useGroups();
	const { currentAccount } = useCurrentAccount();
	const notifications = useNotifications();
	const randomNotifications = $derived(
		shuffle($notifications).slice(0, Math.floor(Math.random() * 5 + 4))
	);
	const accountTrials = $derived($trials.filter((it) => it.accountId === $currentAccount?.id));
	const accountProjects = $derived($projects.filter((it) => it.accountId === $currentAccount?.id));
	const accountGroups = $derived($groups.map((it) => it.accountId === $currentAccount?.id));

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
				shuffle(dummyTrials)
					.slice(0, Math.floor(Math.random() * 2 + 2))
					.forEach((trial) => {
						const trialId = `tri-${createId()}`;

						addTrial({
							...trial,
							id: trialId,
							center: changinCenter,
							layers: [],
							loraConfigId: '',
							type: '',
							area: '',
							parentId: project.id,
							accountId: $currentAccount.id
						});

						const newGroups: Group[] = shuffle(dummyGroups)
							.slice(0, Math.floor(Math.random() * 3 + 2))
							.map((it) => ({
								id: `gr-${createId()}`,
								name: it.name,
								description: it.description,
								accountId: $currentAccount.id,
								deviceIds: [],
								parentId: trialId
							}));

						for (const group of newGroups) {
							addGroup(group);
						}
					});

				addProject(project);
			}
		}
	});
</script>

<Stack direction="horizontal" style={{ width: '100%' }}>
	<Stack style={{ width: '80%', flex: '0 0 auto' }}>
		<Section>
			<PageHeader
				title={$currentAccount?.username || $currentAccount?.email || 'Dashboard'}
				subTitle={$currentAccount?.role}
			/>
		</Section>
		<Section label="Recent Projects" alignItems="flex-start">
			<Grid minmax="45%" style={{ width: '100%' }}>
				{#each shuffle(accountProjects).slice(0, 7) as project}
					<ProjectCard {project} mode="minimal" />
				{/each}
			</Grid>

			<div>
				<Button icon="forward" iconOrder="inverted" href="/desktop-mvp/projects">See all</Button>
			</div>
		</Section>

		<Section label="Recent trials" alignItems="flex-start">
			<Grid minmax="20rem" style={{ width: '100%' }}>
				{#each shuffle(accountTrials).slice(0, 5) as trial}
					<TrialCard {trial} mode="minimal" />
				{/each}
			</Grid>
		</Section>
	</Stack>
	<Section label="Last Notifications" innerStyle={{ paddingLeft: '0' }}>
		<Grid minmax="100%">
			{#each randomNotifications as notification}
				<NotificationCard {notification} mode="minimal" />
			{/each}
		</Grid>

		<Button icon="forward" iconOrder="inverted" href="/desktop-mvp/notifications">See all</Button>
	</Section>
</Stack>
