<script lang="ts">
	import Section from '../../../components/desktop/Section.svelte';
	import Stack from '../../../components/desktop/Stack.svelte';
	import Validation from '../../../components/desktop/Validation.svelte';
	import Button from '../../../components/layout/Button.svelte';
	import PageHeader from '../../../components/layout/PageHeader.svelte';
	import TextInput from '../../../components/layout/TextInput.svelte';
	import { useCurrentAccount } from '../../../stores';

	const { currentAccount } = useCurrentAccount();
</script>

{#if $currentAccount}
	<Stack style={{ width: '100%' }}>
		<Section>
			<PageHeader title="Account" subTitle={$currentAccount.email} />
		</Section>

		<Section label="Settings" style={{ maxWidth: '40rem' }}>
			<TextInput label="Username" defaultValue="Jon" />
			<TextInput label="Email" defaultValue={$currentAccount.email} />
			<TextInput label="Reset Password" />
			<Button icon="navigate">Reset</Button>
		</Section>

		<Section label="Organisation" style={{ maxWidth: '40rem' }}>
			<TextInput label="Organisation Name" defaultValue={$currentAccount.organizationName} />
		</Section>

		<Section>
			<Validation validateLabel="Save" onvalidate={() => {}} />
		</Section>
	</Stack>
{/if}
