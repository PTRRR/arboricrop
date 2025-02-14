<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Checkbox from '../../../../../components/wireframe/Checkbox.svelte';
	import Spacer from '../../../../../components/Spacer.svelte';
	import SaveSection from '../../../../../components/wireframe/SaveSection.svelte';
	import Section from '../../../../../components/wireframe/Section.svelte';
	import { useLoRaConfigurations, useReturnButton } from '../../../../../stores';
	import type { LoRaConfigurationWithId } from '../../../../../utils/types';

	const returnButton = useReturnButton();
	const { loRaConfigurations, updateConfiguration, removeConfiguration } = useLoRaConfigurations();

	const initialConfig = $loRaConfigurations.find((c) => c.id === $page.params.id);

	returnButton.set({
		label: 'LoRa',
		href: '/mobile-wireframe/settings'
	});

	let name = $state(initialConfig?.name || '');
	let frequency = $state(initialConfig?.frequency || 0);
	let bandwidth = $state(initialConfig?.bandwidth || 0);
	let spreadingFactor = $state(initialConfig?.spreadingFactor || 0);
	let codingRate = $state(initialConfig?.codingRate || 0);
	let deviceEui = $state(initialConfig?.deviceEui || '');
	let appEui = $state(initialConfig?.appEui || '');
	let appKey = $state(initialConfig?.appKey || '');
	let isDefault = $state(initialConfig?.isDefault || false);

	let configuration = $derived<LoRaConfigurationWithId>({
		id: initialConfig?.id || '',
		name,
		frequency,
		bandwidth,
		spreadingFactor,
		codingRate,
		deviceEui,
		appEui,
		appKey,
		isDefault
	});
</script>

<div class="update-lora-configuation">
	<Section title="Update LoRa configuration:">
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
		<Spacer />
		<label for="">Set as default:</label>
		<Spacer />
		<Checkbox initialChecked={isDefault} onChange={(checked) => (isDefault = checked)} />
	</Section>

	<Section title="Confirm changes:">
		<SaveSection
			onSave={() => {
				if (isDefault) {
					$loRaConfigurations.forEach((config) =>
						updateConfiguration({ ...config, isDefault: false })
					);
				}

				updateConfiguration(configuration);
				goto('/mobile-wireframe/settings');
			}}
			onDelete={() => {
				removeConfiguration(configuration.id);
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
