<script lang="ts">
	import { useDevices, useGroups, useNotifications, useTrials } from '../../stores';
	import { shuffle } from '../../utils/arrays';
	import type { Project } from '../../utils/types';
	import StatusDot from '../mobile-layout/StatusDot.svelte';
	import Spacer from '../Spacer.svelte';
	import Stack from './Stack.svelte';

	interface Props {
		project: Project;
		mode?: 'normal' | 'minimal';
	}

	const { project, mode = 'normal' }: Props = $props();
	const { trials } = useTrials();
	const { devices } = useDevices();
	const { groups } = useGroups();
	const notifications = useNotifications();
	const projectTrials = $derived($trials.filter((it) => it.parentId === project.id));
	const projectTrailsIds = $derived(projectTrials.map((it) => it.id));
	const projectGroups = $derived(
		$groups.filter((it) => projectTrailsIds.includes(it.parentId || ''))
	);
	const projectGroursIds = $derived(projectGroups.map((it) => it.id));
	const projectActiveDevices = $derived(
		$devices.filter((it) => it.parentId && projectGroursIds.includes(it.parentId))
	);

	const randomNotifications = $derived(
		shuffle($notifications).slice(0, Math.floor(Math.random() * 5))
	);

	const projectStatusTypes = $derived(
		randomNotifications
			.map((it) => it.type)
			.reduce<Record<string, number>>((acc, it) => {
				if (!acc[it]) acc[it] = 0;
				acc[it]++;
				return acc;
			}, {})
	);

	const projectStatusColor = $derived(
		projectStatusTypes['alert'] && projectStatusTypes['alert'] > 0
			? 'error'
			: projectStatusTypes['warning'] && projectStatusTypes['warning'] > 0
				? 'warning'
				: projectStatusTypes['notification'] && projectStatusTypes['notification'] > 0
					? 'normal'
					: 'success'
	);

	const projectStatusLabel = $derived(
		projectStatusTypes['alert'] && projectStatusTypes['alert'] > 0
			? `${projectStatusTypes['alert']} alerts`
			: projectStatusTypes['warning'] && projectStatusTypes['warning'] > 0
				? `${projectStatusTypes['warning']} warnings`
				: projectStatusTypes['notification'] && projectStatusTypes['notification'] > 0
					? `${projectStatusTypes['notification']} notifications`
					: 'No Issues'
	);
</script>

<a
	class="project-card"
	href={`/desktop-mvp/projects/${project.id}`}
	class:project-card--minimal={mode === 'minimal'}
>
	<Stack gap="0.2rem">
		<span class="project-card__title">{project.name}</span>
		<span class="project-card__description">{project.description}</span>

		{#if mode === 'normal'}
			<Spacer size="1.5rem" />
			<span class="project-card__devices">{`${projectActiveDevices.length} Devices`}</span>
			<Stack direction="horizontal" alignItems="center" gap="0.5rem">
				<StatusDot status={projectStatusColor} />
				<span>{projectStatusLabel}</span>
			</Stack>
		{/if}
	</Stack>
</a>

<style lang="scss">
	.project-card {
		$root: &;
		background-color: var(--light-grey);
		padding: 1rem;
		border-radius: 1rem;
		text-decoration: none;
		color: black;

		&__title {
			font-size: var(--big-font-size);
			line-height: 1;

			#{$root}--minimal & {
				font-size: var(--mid-font-size);
			}
		}

		&__description {
			font-size: var(--mid-font-size);
			font-weight: 200;
			color: var(--black);
			max-width: 25em;

			#{$root}--minimal & {
				font-size: var(--main-font-size);
			}
		}

		&:hover {
			background-color: var(--grey);
		}
	}
</style>
