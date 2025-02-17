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

	returnButton.set({
		label: ``,
		backHref: data.baseUrl
	});
</script>

<PageHeader title="Account" />

<Section>
	<TextInput label="First name" defaultValue="Jon" />
	<TextInput label="Last name" defaultValue="Doe" />
</Section>

<ActionMenu>
	<ActionButton href={data.baseUrl}>Save</ActionButton>
</ActionMenu>
