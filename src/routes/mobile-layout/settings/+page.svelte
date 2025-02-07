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
	import Table from '../../../components/mobile-layout/Table.svelte';
	import PageHeader from '../../../components/mobile-layout/PageHeader.svelte';
	import SaveMenu from '../../../components/mobile-layout/SaveMenu.svelte';
	import SubPage from '../../../components/mobile-layout/SubPage.svelte';

	const usedNetwork = useNetwork();
	const returnButton = useReturnButton();
	const organisation = useOrganisation();
	const { organisations } = useOrganisations();
	const { userMode, setUserMode } = useUserMode();
	const { loRaConfigurations } = useLoRaConfigurations();

	let selectedNetwork = $state($usedNetwork);
	let selectedOrganisation = $state($organisation);
	let switchOrganisation = $state(false);

	returnButton.set({
		label: ``,
		backHref: `/mobile-layout`
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

	<Section label="User Mode">
		<div class="settings__user-mode">
			<Checkbox
				initialChecked={$userMode === 'advanced'}
				onChange={(checked) => setUserMode(checked ? 'advanced' : 'normal')}
			/>
			<span>{$userMode === 'advanced' ? 'Advanced' : 'Normal'}</span>
		</div>
	</Section>

	{#if $organisations.length > 0}
		<Section label="Organisation">
			{#if $organisation}
				<Table
					headers={[{ label: 'Selected organisation' }]}
					rows={[{ cells: [{ label: $organisation || '' }] }]}
				/>
			{/if}

			<SubPage icon="navigate" label="Switch Organisation" bind:opened={switchOrganisation}>
				<PageHeader title="Organisations" />
				<Section>
					<Table
						headers={[{ label: 'Name' }]}
						rows={[
							{
								onclick: () => ($organisation = ''),
								cells: [{ label: 'None' }]
							},
							...$organisations.map((it) => ({
								onclick: () => ($organisation = it),
								selected: $organisation === it,
								cells: [{ label: it }]
							}))
						]}
					/>
				</Section>
			</SubPage>
		</Section>
	{/if}

	<SaveMenu
		hidden={switchOrganisation}
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
