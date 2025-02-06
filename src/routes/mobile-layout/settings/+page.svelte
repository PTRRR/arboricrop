<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Button from '../../../components/mobile-layout/Button.svelte';
	import ButtonList from '../../../components/wireframe/ButtonList.svelte';
	import CenteredWrapper from '../../../components/wireframe/CenteredWrapper.svelte';
	import Info from '../../../components/Info.svelte';
	import SaveSection from '../../../components/wireframe/SaveSection.svelte';
	import Separation from '../../../components/Separation.svelte';
	import {
		useLoRaConfigurations,
		useNetwork,
		useOrganisation,
		useOrganisations,
		useReturnButton,
		useUserMode
	} from '../../../stores';
	import { loraNetworks } from '../../../utils/dummyData';
	import Section from '../../../components/mobile-layout/Section.svelte';
	import Checkbox from '../../../components/mobile-layout/Checkbox.svelte';
	import TextInput from '../../../components/mobile-layout/TextInput.svelte';
	import Table from '../../../components/mobile-layout/Table.svelte';
	import PageHeader from '../../../components/mobile-layout/PageHeader.svelte';
	import SaveMenu from '../../../components/mobile-layout/SaveMenu.svelte';

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
	<PageHeader title="Settings" />

	<Section>
		<div class="settings__user-mode">
			<Checkbox
				initialChecked={$userMode === 'advanced'}
				onChange={(checked) => setUserMode(checked ? 'advanced' : 'normal')}
			/>
			<span>{$userMode === 'advanced' ? 'Advanced User Mode' : 'Normal User Mode'}</span>
		</div>
	</Section>

	{#if $organisations.length > 0}
		<Section label="Account settings">
			<Info label="Selected organisation:" value={$organisation || '-'} />
			<Button href={`${window.location.pathname}?organisation=true`}>Switch organisation</Button>
		</Section>
	{/if}

	<!-- <Section title="Notification settings:">
		<Info label="Status:" value="unmuted" />
		<Button>Mute notifications</Button>
	</Section> -->

	<Section
		label="LoRa Configurations"
		actions={[{ icon: 'add', onclick: () => goto(`${window.location.pathname}/lora/new`) }]}
	>
		<Table
			headers={[
				{ label: 'Name', width: '70%' },
				{ label: 'Is Default', width: '30%' }
			]}
			rows={$loRaConfigurations.map((it) => ({
				href: `${window.location.pathname}/lora/${it.id}`,
				cells: [{ label: it.name }, { label: it.isDefault ? 'Yes' : '' }]
			}))}
		/>
	</Section>

	<SaveMenu
		oncancel={() => {
			goto('/mobile-layout');
		}}
		onsave={() => {
			goto('/mobile-layout');
		}}
	/>
{/if}

<style lang="scss">
	.settings {
		&__user-mode {
			display: flex;
			align-items: center;
			gap: 1rem;
			text-transform: lowercase;
			font-weight: normal;
		}
	}
</style>
