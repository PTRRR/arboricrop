<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Spacer from '../../../components/Spacer.svelte';
	import Button from '../../../components/Button.svelte';
	import ButtonList from '../../../components/wireframe/ButtonList.svelte';
	import CenteredWrapper from '../../../components/wireframe/CenteredWrapper.svelte';
	import Info from '../../../components/Info.svelte';
	import SaveSection from '../../../components/wireframe/SaveSection.svelte';
	import Separation from '../../../components/Separation.svelte';
	import { useNetwork, useOrganisation, useOrganisations, useReturnButton } from '../../../stores';
	import { loraNetworks } from '../../../utils/dummyData';
	import Section from '../../../components/wireframe/Section.svelte';

	const usedNetwork = useNetwork();
	const returnButton = useReturnButton();
	const organisation = useOrganisation();
	const { organisations } = useOrganisations();

	let selectedNetwork = $usedNetwork;
	let selectedOrganisation = $organisation;

	returnButton.set({
		label: 'Settings',
		href: '/mobile-wireframe'
	});
</script>

{#if $page.data.network}
	<CenteredWrapper>
		<Separation title="Available networks:" />
		<ButtonList
			items={loraNetworks}
			let:item
			selectedItems={[selectedNetwork]}
			onSelect={(network) => (selectedNetwork = network)}
		>
			{item}
		</ButtonList>
		<Spacer />
		<Separation />
		<SaveSection
			onSave={() => {
				usedNetwork.set(selectedNetwork);
				goto(window.location.pathname);
			}}
			onCancel={() => goto(window.location.pathname)}
		/>
	</CenteredWrapper>
{:else if $page.data.organisation}
	<CenteredWrapper>
		<Separation title="Organisations:" />
		<ButtonList
			items={$organisations}
			let:item
			selectedItems={[selectedOrganisation]}
			onSelect={(organisation) => (selectedOrganisation = organisation)}
		>
			{item}
		</ButtonList>
		<Spacer />
		<Separation />
		<SaveSection
			onSave={() => {
				usedNetwork.set(selectedNetwork);
				organisation.set(selectedOrganisation);
				goto(window.location.pathname);
			}}
			onCancel={() => goto(window.location.pathname)}
		/>
	</CenteredWrapper>
{:else}
	<Section title="User settings:">
		<label for="">First name:</label>
		<Spacer />
		<input type="text" placeholder="First name" value="Jon" />
		<Spacer />
		<label for="">Last name:</label>
		<Spacer />
		<input type="text" placeholder="Last name" value="Doe" />
	</Section>

	{#if $organisations.length > 0}
		<Section title="Account settings:">
			<Info label="Selected organisation:" value={$organisation} />
			<Spacer />
			<Button href={`${window.location.pathname}?organisation=true`}>Switch organisation</Button>
		</Section>
	{/if}

	<Section title="Notification settings:">
		<Info label="Status:" value="unmuted" />
		<Spacer />
		<Button>Mute notifications</Button>
	</Section>

	<Section title="Notification settings:">
		<Info label="Default gateway:" value={$usedNetwork} />
		<Spacer />
		<Button href={`${window.location.pathname}?network=true`}>Set default network gateway</Button>
	</Section>

	<Section title="Confirm changes:">
		<SaveSection
			onSave={() => goto('/mobile-wireframe')}
			onCancel={() => goto('/mobile-wireframe')}
		/>
	</Section>
{/if}

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
