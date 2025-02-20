<script lang="ts">
	import { page } from '$app/state';
	import DangerZone from '../../../../components/desktop/DangerZone.svelte';
	import Section from '../../../../components/desktop/Section.svelte';
	import Stack from '../../../../components/desktop/Stack.svelte';
	import Validation from '../../../../components/desktop/Validation.svelte';
	import Button from '../../../../components/layout/Button.svelte';
	import PageHeader from '../../../../components/layout/PageHeader.svelte';
	import TextInput from '../../../../components/layout/TextInput.svelte';
	import { useAccounts } from '../../../../stores';

	const { accounts } = useAccounts();
	const organizationId = page.params.id;
	const organization = $derived($accounts.find((it) => it.id === organizationId));

	let editOrganization = $state(false);
</script>

{#if organization}
	{#snippet title()}
		<Stack
			direction="horizontal"
			style={{ width: '100%' }}
			alignItems="center"
			justifyContent="space-between"
		>
			{organization.username || organization.organizationName}
			<Button icon="navigate" iconOrder="inverted" onclick={() => (editOrganization = true)}
				>Edit</Button
			>
		</Stack>
	{/snippet}

	<Stack direction="horizontal" style={{ width: '100%' }}>
		<Stack style={{ width: '100%' }}>
			<Section>
				<PageHeader {title} subTitle={organization.email} />
			</Section>
			<Section label="Users" actions={[{ label: 'Invite', icon: 'add', iconOrder: 'inverted' }]}>
				<p>There are no users yet</p>
			</Section>
		</Stack>

		{#if editOrganization}
			<Section label="edit organization" backgroundColor="var(--light-grey)">
				<TextInput label="organization name" defaultValue={organization.organizationName} />
				<TextInput label="email" defaultValue={organization.email} />
				<Validation
					validateLabel="save"
					onvalidate={() => (editOrganization = false)}
					oncancel={() => (editOrganization = false)}
				/>
				<DangerZone
					label="Delete organization"
					description="Permanently delete this organization and all of its data. This action cannot be undone."
				/>
			</Section>
		{/if}
	</Stack>
{/if}
