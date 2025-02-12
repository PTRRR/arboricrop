<script lang="ts">
	import { createId } from '@paralleldrive/cuid2';

	import Section from '../../../components/desktop/Section.svelte';
	import Stack from '../../../components/desktop/Stack.svelte';
	import { useCurrentAccount, useTrials } from '../../../stores';
	import type { Trial } from '../../../utils/types';
	import TextInput from '../../../components/layout/TextInput.svelte';
	import Map from '../../../components/layout/Map.svelte';
	import Button from '../../../components/layout/Button.svelte';
	import { changinCenter, swissBounds } from '../../../utils/dummyData';
	import { getLocationDelta } from '../../../utils/locations';
	import TrialCard from '../../../components/desktop/TrialCard.svelte';

	const { trials, addTrial } = useTrials();
	const { currentAccount } = useCurrentAccount();
	const accountTrials = $derived($trials.filter((it) => it.accountId === $currentAccount?.id));

	let map = $state<Map | undefined>(undefined);
	let newTrial = $state<Trial | undefined>(undefined);

	const createTrial = $derived(() => {
		newTrial = {
			id: `tri-${createId()}`,
			name: '',
			area: '',
			center: changinCenter,
			layers: [],
			loraConfigId: '',
			type: '',
			parentId: undefined,
			accountId: $currentAccount?.id || ''
		};
	});
</script>

<Stack direction="horizontal" style={{ width: '100%' }}>
	<Section
		label="Trials"
		actions={accountTrials.length > 0
			? [
					{
						label: 'Create',
						icon: 'add',
						iconOrder: 'inverted',
						onclick: createTrial
					}
				]
			: []}
		fill
	>
		{#if accountTrials.length === 0}
			<Button icon="add" onclick={createTrial}>Create Trial</Button>
		{:else}
			<Stack gap="0.5rem">
				<TextInput label="Search" />
				<Button icon="navigate">Submit</Button>
			</Stack>

			<div class="trials__grid">
				{#each accountTrials as trial}
					<TrialCard {trial} />
				{/each}
			</div>
		{/if}
	</Section>

	{#if newTrial}
		<Section label="New Trial" backgroundColor="var(--light-grey)" width="35%">
			<TextInput
				label="Name"
				defaultValue={newTrial.name}
				onvalue={(value) => {
					if (!newTrial) return;
					newTrial.name = value;
				}}
			/>
			<TextInput
				label="Area"
				defaultValue={newTrial.area}
				onvalue={(value) => {
					if (!newTrial) return;
					newTrial.area = value;
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
				onChange={(value) => {
					// const delta = getLocationDelta(value, newTrial.center);
					// if (delta > 0.000001) coords = value;
				}}
			/>
			<Stack gap="0.5rem">
				<Button
					icon="check"
					backgroundColor="var(--light-green)"
					iconBackgroundColor="var(--green)"
					padding
					onclick={() => {
						if (!newTrial) return;
						addTrial(newTrial);
						newTrial = undefined;
					}}
				>
					Save
				</Button>
				<Button
					icon="cross"
					backgroundColor="var(--light-red)"
					iconBackgroundColor="var(--red)"
					padding
					onclick={() => (newTrial = undefined)}
				>
					Close
				</Button>
			</Stack>
		</Section>
	{/if}
</Stack>

<style lang="scss">
	.trials {
		&__grid {
			display: grid;
			grid-template-columns: repeat(auto-fill, minmax(20rem, 1fr));
			gap: calc(var(--section-padding) * 2);
		}
	}
</style>
