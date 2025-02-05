<script lang="ts">
	import PageHeader from '../../../components/mobile-layout/PageHeader.svelte';
	import Section from '../../../components/mobile-layout/Section.svelte';
	import TextInput from '../../../components/mobile-layout/TextInput.svelte';
</script>

<PageHeader title="Account" />

<Section>
	<TextInput label="First name" defaultValue="Jon" />
	<TextInput label="Last name" defaultValue="Doe" />
</Section>
