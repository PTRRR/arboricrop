<script lang="ts">
	import { goto } from '$app/navigation';
	import PageHeader from '../../../components/layout/PageHeader.svelte';
	import SaveMenu from '../../../components/mobile-layout/SaveMenu.svelte';
	import Section from '../../../components/mobile-layout/Section.svelte';
	import TextInput from '../../../components/layout/TextInput.svelte';
	import { useReturnButton } from '../../../stores';

	import ActionMenu from '../../../components/mobile-layout/ActionMenu.svelte';
	import ActionButton from '../../../components/mobile-layout/ActionButton.svelte';
	import type { PageData } from '../$types';

	interface Props {
		data: PageData;
	}

	const { data }: Props = $props();

	const returnButton = useReturnButton();

	let firstName = $state('');
	let lastName = $state('');

	returnButton.set({
		label: ``,
		backHref: data.baseUrl
	});
</script>

<Section>
	<PageHeader title="Account" />
</Section>

<Section>
	<TextInput label="First name" defaultValue="Jon" bind:value={firstName} />
	<TextInput label="Last name" defaultValue="Doe" bind:value={lastName} />
</Section>

{#if firstName !== 'Jon' || lastName !== 'Doe'}
	<ActionMenu>
		<ActionButton
			icon="check"
			backgroundColor="var(--light-green)"
			iconColor="var(--light-green)"
			href={data.baseUrl}>Save</ActionButton
		>
	</ActionMenu>
{/if}
