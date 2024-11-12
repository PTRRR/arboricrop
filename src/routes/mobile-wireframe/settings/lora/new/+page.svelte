<script lang="ts">
	import { goto } from '$app/navigation';
	import { createId } from '@paralleldrive/cuid2';
	import Spacer from '../../../../../components/Spacer.svelte';
	import SaveSection from '../../../../../components/wireframe/SaveSection.svelte';

	import Section from '../../../../../components/wireframe/Section.svelte';
	import { type LoRaConfiguration, type LoRaConfigurationWithId } from '../../../../../utils/types';
	import { useLoRaConfigurations, useReturnButton } from '../../../../../stores';

	const returnButton = useReturnButton();
	const { addConfiguration } = useLoRaConfigurations();

	returnButton.set({
		label: 'LoRa',
		href: '/mobile-wireframe/settings'
	});

	const initialState: LoRaConfiguration = {
		name: 'My custom configuration',
		frequency: 868100000,
		bandwidth: 125000,
		spreadingFactor: 7,
		codingRate: 1,
		deviceEui: '0000000000000000',
		appEui: '0000000000000000',
		appKey: '00000000000000000000000000000000'
	};

	let name = $state(initialState.name);
	let frequency = $state(initialState.frequency);
	let bandwidth = $state(initialState.bandwidth);
	let spreadingFactor = $state(initialState.spreadingFactor);
	let codingRate = $state(initialState.codingRate);
	let deviceEui = $state(initialState.deviceEui);
	let appEui = $state(initialState.appEui);
	let appKey = $state(initialState.appKey);

	let configuration = $derived<LoRaConfigurationWithId>({
		id: createId(),
		name,
		frequency,
		bandwidth,
		spreadingFactor,
		codingRate,
		deviceEui,
		appEui,
		appKey
	});
</script>

<div class="new-lora-configuation">
	<Section title="New LoRa configuration:">
		<label for="">Configuration name:</label>
		<Spacer />
		<input type="text" placeholder="value..." bind:value={name} />
		<Spacer />
		<label for="">Frequency:</label>
		<Spacer />
		<input type="number" placeholder="value..." bind:value={frequency} />
		<Spacer />
		<label for="">Bandwidth:</label>
		<Spacer />
		<input type="number" placeholder="value..." bind:value={bandwidth} />
		<Spacer />
		<label for="">Spreading Factor:</label>
		<Spacer />
		<input type="number" placeholder="value..." bind:value={spreadingFactor} />
		<Spacer />
		<label for="">Coding Rate:</label>
		<Spacer />
		<input type="number" placeholder="value..." bind:value={codingRate} />
		<Spacer />
		<label for="">App Eui:</label>
		<Spacer />
		<input type="text" placeholder="value..." bind:value={appEui} />
		<Spacer />
		<label for="">App Key:</label>
		<Spacer />
		<input type="text" placeholder="value..." bind:value={appKey} />
	</Section>

	<Section title="Confirm changes:">
		<SaveSection
			onSave={() => {
				addConfiguration(configuration);
				goto('/mobile-wireframe/settings');
			}}
			onCancel={() => goto('/mobile-wireframe/settings')}
		/>
	</Section>
</div>

<style>
	input {
		font-family: inherit;
		font-size: inherit;
		padding: 1rem;
		border: solid 1px var(--black);
		background-color: var(--white);
		outline: none;
		max-width: 100%;
		resize: vertical;
	}
</style>
