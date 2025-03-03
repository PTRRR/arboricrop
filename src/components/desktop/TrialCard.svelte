<script lang="ts">
	import { useDevices, useGroups } from '../../stores';
	import { swissBounds } from '../../utils/dummyData';
	import type { Trial } from '../../utils/types';
	import Map from '../layout/Map.svelte';
	import StatusDot from '../mobile-layout/StatusDot.svelte';
	import Stack from './Stack.svelte';

	interface Props {
		trial: Trial;
		mode?: 'normal' | 'minimal';
	}

	const { trial, mode = 'minimal' }: Props = $props();
	const { devices } = useDevices();
	const { groups } = useGroups();
	const trialGroups = $derived($groups.filter((it) => trial.id === it.parentId));
	const trialGroupsIds = $derived(trialGroups.map((it) => it.id));
	const trialDevices = $derived(
		$devices.filter((it) => it.parentId && trialGroupsIds.includes(it.parentId))
	);
</script>

<a class="trial" href={`/desktop-mvp/trials/${trial.id}`} class:trial--minimal={mode === 'minimal'}>
	<div class="trial__map">
		<Map
			center={trial.center}
			maxBounds={swissBounds}
			ratio={mode === 'minimal' ? 1 : 2.5}
			zoom={15}
			minZoom={3}
			maxZoom={18}
			geoJSONs={trial.layers}
		/>
	</div>

	<Stack
		style={{ padding: mode === 'normal' ? '1rem' : '0.6rem 1rem' }}
		justifyContent="space-between"
		gap="0.5rem"
	>
		<Stack direction="horizontal" alignItems="center" gap="0.5rem">
			<!-- <StatusDot status={trialDevices.length > 0 ? 'success' : 'neutral'} /> -->
			<p class="trial__name">{trial.name}</p>
		</Stack>

		<p class="trial__sub-title">{trialDevices.length} Active Devices</p>
		{#if mode === 'normal'}{/if}
	</Stack>
</a>

<style lang="scss">
	.trial {
		$root: &;
		display: flex;
		flex-direction: column;
		background-color: var(--light-grey);
		border-radius: 0.8rem;
		color: var(--black);
		text-decoration: none;

		&--minimal {
			flex-direction: row;
			// align-items: center;
		}

		&__map {
			display: contents;
			pointer-events: none;

			#{$root}--minimal & {
				display: block;
				height: 80px;
				width: 80px;
				flex: 0 0 auto;
			}
		}

		&__name {
			font-size: var(--mid-font-size);
			display: -webkit-box;
			-webkit-line-clamp: 2;
			-webkit-box-orient: vertical;
			overflow: hidden;
			line-clamp: 3;
			box-orient: vertical;
		}

		&__sub-title {
			font-size: var(--main-font-size);
			color: var(--black);
			font-weight: 100;
		}

		&:hover {
			background-color: var(--grey);
		}
	}
</style>
