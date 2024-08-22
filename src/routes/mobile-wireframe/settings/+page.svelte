<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Spacer from '../../../components/Spacer.svelte';
	import Button from '../../../components/wireframe/Button.svelte';
	import ButtonList from '../../../components/wireframe/ButtonList.svelte';
	import CenteredWrapper from '../../../components/wireframe/CenteredWrapper.svelte';
	import Info from '../../../components/wireframe/Info.svelte';
	import SaveSection from '../../../components/wireframe/SaveSection.svelte';
	import Separation from '../../../components/wireframe/Separation.svelte';
	import { useNetwork, useOrganisation, useReturnButton } from '../../../stores';
	import { loraNetworks, organisations } from '../../../utils/dummyData';

	const usedNetwork = useNetwork();
	const returnButton = useReturnButton();
	const organisation = useOrganisation();

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
			items={organisations}
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
	<Separation title="User settings:" />
	<label for="">First name:</label>
	<Spacer />
	<input type="text" placeholder="First name" value="Jon" />
	<Spacer />
	<label for="">Last name:</label>
	<Spacer />
	<input type="text" placeholder="Last name" value="Doe" />
	<Spacer />
	<Spacer />

	<Separation title="Account settings:" />
	<Info label="Selected organisation:" value={$organisation} />
	<Spacer />
	<Button href={`${window.location.pathname}?organisation=true`}>Switch organisation</Button>
	<Spacer />
	<Spacer />

	<Separation title="Notification settings:" />
	<Info label="Status:" value="unmuted" />
	<Spacer />
	<Button>Mute notifications</Button>
	<Spacer />
	<Spacer />

	<Separation title="Advanced settings:" />
	<Info label="Default gateway:" value={$usedNetwork} />
	<Spacer />
	<Button href={`${window.location.pathname}?network=true`}>Set default network gateway</Button>

	<Spacer />
	<Spacer />
	<Spacer />
	<Spacer />
	<Separation />
	<Spacer />
	<Spacer />
	<Spacer />
	<SaveSection
		onSave={() => goto('/mobile-wireframe')}
		onCancel={() => goto('/mobile-wireframe')}
	/>
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
