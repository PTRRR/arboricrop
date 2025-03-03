<script lang="ts">
	import { createId } from '@paralleldrive/cuid2';

	import Section from '../../../components/desktop/Section.svelte';
	import Stack from '../../../components/desktop/Stack.svelte';
	import { useCurrentAccount, useTrials } from '../../../stores';
	import type { Trial } from '../../../utils/types';
	import TextInput from '../../../components/layout/TextInput.svelte';
	import Map from '../../../components/layout/Map.svelte';
	import Button from '../../../components/layout/Button.svelte';
	import { changinCenter, dummyTrials, swissBounds } from '../../../utils/dummyData';
	import { getLocationDelta } from '../../../utils/locations';
	import TrialCard from '../../../components/desktop/TrialCard.svelte';
	import PageHeader from '../../../components/layout/PageHeader.svelte';
	import SearchBar from '../../../components/desktop/SearchBar.svelte';
	import Grid from '../../../components/desktop/Grid.svelte';
	import { onMount } from 'svelte';
	import { shuffle } from '../../../utils/arrays';
	import Validation from '../../../components/desktop/Validation.svelte';

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

	onMount(() => {
		if (accountTrials.length === 0) {
			shuffle(dummyTrials)
				.slice(0, 8)
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
	});
</script>

{#snippet title()}
	<Stack
		direction="horizontal"
		alignItems="center"
		justifyContent="space-between"
		style={{ width: '100%' }}
	>
		Trials
		<Stack direction="horizontal" gap="0.5rem">
			<Stack direction="horizontal" gap="0.5rem">
				<TextInput placeholder="Search" />
				<Button icon="search"></Button>
			</Stack>
			<Button icon="add" iconOrder="inverted" onclick={createTrial}>Create</Button>
		</Stack>
	</Stack>
{/snippet}

<Stack direction="horizontal" style={{ width: '100%' }}>
	<Section
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
		<PageHeader {title} subTitle={`${accountTrials.length} Active Trials`} />
		{#if accountTrials.length === 0}
			<Button icon="add" onclick={createTrial}>Create Trial</Button>
		{:else}
			<SearchBar />

			<Grid>
				{#each accountTrials as trial}
					<TrialCard {trial} />
				{/each}
			</Grid>
		{/if}
	</Section>

	{#if newTrial}
		<Section
			label="New Trial"
			backgroundColor="var(--light-grey)"
			sticky="var(--content-offset-top)"
			width="40%"
		>
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

			<Validation
				onvalidate={() => {
					if (!newTrial) return;
					addTrial(newTrial);
					newTrial = undefined;
				}}
				oncancel={() => (newTrial = undefined)}
			/>
		</Section>
	{/if}
</Stack>
