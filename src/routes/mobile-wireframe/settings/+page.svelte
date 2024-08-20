<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Spacer from '../../../components/Spacer.svelte';
	import Button from '../../../components/wireframe/Button.svelte';
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
	<div class="network-settings">
		<Separation title="Available networks:" />
		<div class="networks">
			{#each loraNetworks as network}
				<Button selected={selectedNetwork === network} on:click={() => (selectedNetwork = network)}>
					{network}
				</Button>
			{/each}
		</div>
		<Spacer />
		<Separation />
		<SaveSection
			onSave={() => {
				usedNetwork.set(selectedNetwork);
				goto(window.location.pathname);
			}}
			onCancel={() => goto(window.location.pathname)}
		/>
	</div>
{:else if $page.data.organisation}
	<div class="network-settings">
		<Separation title="Organisations:" />
		<div class="organisations">
			{#each organisations as organisation}
				<Button
					selected={selectedOrganisation === organisation}
					on:click={() => (selectedOrganisation = organisation)}
				>
					{organisation}
				</Button>
			{/each}
		</div>
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
	</div>
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
	<label for="">Organisation:</label>
	<Spacer />
	<input type="text" placeholder="Organisation" value={$organisation} />
	<Spacer />
	<Button href={`${window.location.pathname}?organisation=true`}>Switch organisation</Button>
	<Spacer />
	<Spacer />

	<Separation title="Notification settings:" />
	<Button>Mute notifications</Button>
	<Spacer />
	<Spacer />

	<Separation title="Advanced settings:" />
	<label for="">Default gateway:</label>
	<Spacer />
	<input type="text" value={$usedNetwork} />
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
	.network-settings {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 1rem;
		flex: 1 1 auto;
	}

	.networks,
	.organisations {
		width: 100%;
		display: flex;
		flex-direction: column;
		gap: var(--gap);
	}

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
