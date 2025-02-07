<script lang="ts">
	import { goto } from '$app/navigation';
	import PageHeader from '../../../components/mobile-layout/PageHeader.svelte';
	import SaveMenu from '../../../components/mobile-layout/SaveMenu.svelte';
	import Section from '../../../components/mobile-layout/Section.svelte';
	import TextInput from '../../../components/mobile-layout/TextInput.svelte';
	import { useReturnButton } from '../../../stores';

	const returnButton = useReturnButton();

	returnButton.set({
		label: ``,
		backHref: `/mobile-layout`
	});
</script>

<PageHeader title="Account" />

<Section>
	<TextInput label="First name" defaultValue="Jon" />
	<TextInput label="Last name" defaultValue="Doe" />
</Section>

<SaveMenu oncancel={() => goto('/mobile-layout')} onsave={() => goto('/mobile-layout')} />
