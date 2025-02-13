<script lang="ts">
	import { useDevices, useTrials } from '../../stores';
	import type { Project } from '../../utils/types';
	import StatusDot from '../mobile-layout/StatusDot.svelte';
	import Spacer from '../Spacer.svelte';
	import Stack from './Stack.svelte';

	interface Props {
		project: Project;
	}

	const { project }: Props = $props();
	const { trials } = useTrials();
	const { devices } = useDevices();
	const projectTrials = $derived($trials.filter((it) => it.parentId === project.id));
	const projectTrailsIds = $derived(projectTrials.map((it) => it.id));
	const projectActiveDevices = $derived(
		$devices.filter((it) => it.parentId && projectTrailsIds.includes(it.parentId))
	);
</script>

<a class="project-card" href={`/desktop-mvp/projects/${project.id}`}>
	<Stack gap="0.4rem">
		<span class="project-card__title">{project.name}</span>
		<span class="project-card__description">{project.description}</span>
		<Spacer size="1.5rem" />
		<span class="project-card__devices">{`${projectActiveDevices.length} Devices`}</span>
		<Stack direction="horizontal" alignItems="center" gap="0.5rem">
			<StatusDot status="success" />
			<span>No issues</span>
		</Stack>
	</Stack>
</a>

<style lang="scss">
	.project-card {
		$this: &;
		background-color: var(--light-grey);
		padding: 1rem;
		border-radius: 1rem;
		text-decoration: none;
		color: black;

		&__title {
			font-size: var(--big-font-size);
			line-height: 1;
		}

		&__description {
			font-size: var(--mid-font-size);
			color: var(--grey);
		}

		&:hover {
			background-color: var(--grey);

			#{$this}__description {
				color: var(--dark-grey);
			}
		}
	}
</style>
