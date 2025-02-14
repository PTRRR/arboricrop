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
	import {
		useLoRaConfigurations,
		useNetwork,
		useOrganisation,
		useOrganisations,
		useReturnButton,
		useUserMode
	} from '../../../stores';
	import { loraNetworks } from '../../../utils/dummyData';
	import Section from '../../../components/wireframe/Section.svelte';
	import Checkbox from '../../../components/wireframe/Checkbox.svelte';

	const usedNetwork = useNetwork();
	const returnButton = useReturnButton();
	const organisation = useOrganisation();
	const { organisations } = useOrganisations();
	const { userMode, setUserMode } = useUserMode();
	const { loRaConfigurations } = useLoRaConfigurations();

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
			<Info label="Selected organisation:" value={$organisation || '-'} />
			<Spacer />
			<Button href={`${window.location.pathname}?organisation=true`}>Switch organisation</Button>
		</Section>
	{/if}

	<!-- <Section title="Notification settings:">
		<Info label="Status:" value="unmuted" />
		<Spacer />
		<Button>Mute notifications</Button>
	</Section> -->

	<Section title="Advanced settings:">
		<Info label="LoRa configurations:" />
		<Spacer />
		<ButtonList items={$loRaConfigurations} let:item>
			<div class="lora-config">
				<Button minimal href={`${window.location.pathname}/lora/${item.id}`}>
					{item.name}
				</Button>
				{#if item.isDefault}
					<span>Is Default</span>
				{/if}
			</div>
		</ButtonList>
		<Spacer />
		<Button href={`${window.location.pathname}/lora/new`}>Create configuration</Button>
		<Spacer />
		<Info label={`User mode: ${$userMode}`} />
		<Spacer />
		<Checkbox
			initialChecked={$userMode === 'advanced'}
			onChange={(checked) => setUserMode(checked ? 'advanced' : 'normal')}
		/>
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

	.lora-config {
		display: flex;
		justify-content: space-between;
		width: 100%;
	}
</style>
