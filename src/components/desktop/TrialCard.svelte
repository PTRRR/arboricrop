<script lang="ts">
	import { useDevices } from '../../stores';
	import { swissBounds } from '../../utils/dummyData';
	import type { Trial } from '../../utils/types';
	import Map from '../layout/Map.svelte';
	import StatusDot from '../mobile-layout/StatusDot.svelte';
	import Stack from './Stack.svelte';

	interface Props {
		trial: Trial;
	}

	const { trial }: Props = $props();
	const { devices } = useDevices();
	const trialDevices = $derived($devices.filter((it) => it.parentId === trial.id));
</script>

<a class="trial" href={`/desktop-mvp/trials/${trial.id}`}>
	<div class="trial__map">
		<Map
			center={trial.center}
			maxBounds={swissBounds}
			ratio={2.5}
			zoom={15}
			minZoom={3}
			maxZoom={18}
			geoJSONs={trial.layers}
		/>
	</div>

	<Stack style={{ padding: '1rem' }} gap="0.5rem">
		<Stack direction="horizontal" alignItems="center" gap="0.5rem">
			<StatusDot status={trialDevices.length > 0 ? 'success' : 'neutral'} />
			<p class="trial__name">{trial.name}</p>
		</Stack>
		<p class="trial__sub-title">{trialDevices.length} Active Devices</p>
	</Stack>
</a>

<style lang="scss">
	.trial {
		background-color: var(--light-grey);
		border-radius: 0.8rem;
		color: var(--black);
		text-decoration: none;

		&__map {
			display: contents;
			pointer-events: none;
		}

		&__name {
			font-size: var(--mid-font-size);
		}

		&__sub-title {
			color: var(--grey);
		}
	}
</style>
