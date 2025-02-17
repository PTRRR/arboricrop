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
	import Table from '../../../components/layout/Table.svelte';
	import PageHeader from '../../../components/layout/PageHeader.svelte';
	import SubPage from '../../../components/mobile-layout/SubPage.svelte';
	import ActionMenu from '../../../components/mobile-layout/ActionMenu.svelte';
	import ActionButton from '../../../components/mobile-layout/ActionButton.svelte';
	import type { PageData } from './$types';

	interface Props {
		data: PageData;
	}

	const { data }: Props = $props();

	const returnButton = useReturnButton();
	const organisation = useOrganisation();
	const { organisations } = useOrganisations();
	const { userMode, setUserMode } = useUserMode();
	const { loRaConfigurations } = useLoRaConfigurations();
	let switchOrganisation = $state(false);

	returnButton.set({
		label: ``,
		backHref: data.baseUrl
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

<ActionMenu>
	<ActionButton href={data.baseUrl}>Save</ActionButton>
</ActionMenu>

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
