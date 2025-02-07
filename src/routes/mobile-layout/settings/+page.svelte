<script lang="ts">
	import { goto } from '$app/navigation';
	import {
		useLoRaConfigurations,
		useOrganisation,
		useOrganisations,
		useReturnButton,
		useUserMode
	} from '../../../stores';
	import Section from '../../../components/mobile-layout/Section.svelte';
	import Checkbox from '../../../components/mobile-layout/Checkbox.svelte';
	import Table from '../../../components/mobile-layout/Table.svelte';
	import PageHeader from '../../../components/mobile-layout/PageHeader.svelte';
	import SaveMenu from '../../../components/mobile-layout/SaveMenu.svelte';
	import SubPage from '../../../components/mobile-layout/SubPage.svelte';

	const returnButton = useReturnButton();
	const organisation = useOrganisation();
	const { organisations } = useOrganisations();
	const { userMode, setUserMode } = useUserMode();
	const { loRaConfigurations } = useLoRaConfigurations();
	let switchOrganisation = $state(false);

	returnButton.set({
		label: ``,
		backHref: `/mobile-layout`
	});
</script>

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
