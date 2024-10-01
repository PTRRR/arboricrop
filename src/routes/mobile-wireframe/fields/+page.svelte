<script lang="ts">
	import Button from '../../../components/Button.svelte';
	import Card from '../../../components/wireframe/Card.svelte';
	import { useDevices, useFields, useReturnButton } from '../../../stores';
	import { getDevicesByFieldId } from '../../../utils/dummyData';
	import Section from '../../../components/wireframe/Section.svelte';
	import Spacer from '../../../components/Spacer.svelte';

	let returnButton = useReturnButton();
	returnButton.set({
		label: 'Fields',
		href: '/mobile-wireframe'
	});

	const { fields } = useFields();
	const { devices } = useDevices();
</script>

<div class="fields">
	<Section
		title="Fields:"
		buttons={[{ label: 'Create new field', href: '/mobile-wireframe/fields/new' }]}
	>
		{#if $fields.length > 0}
			<div class="fields__list">
				{#each $fields as field}
					<Card href={`/mobile-wireframe/fields/${field.id}`}>
						<h5 slot="title">{field.name}</h5>
						<span slot="subTitle">
							{field.type} [{getDevicesByFieldId($devices, field.id).length} devices]
						</span>
					</Card>
				{/each}
			</div>
		{:else}
			No fields
			<Spacer />
			<Button href="/mobile-wireframe/fields/new">Create new field</Button>
		{/if}
	</Section>

	<Section title="All devices:">
		{#if $devices.length === 0}
			<span>No devices</span>
			<Spacer />
			<Button href="/mobile-wireframe/devices/pairing">Pair new device</Button>
		{:else}
			<Button href="/mobile-wireframe/devices">See all devices</Button>
		{/if}
	</Section>
</div>

<style>
	.fields {
		display: flex;
		flex-direction: column;
		gap: var(--gap);
	}

	.fields__list {
		display: flex;
		flex-direction: column;
		gap: var(--gap);
	}
</style>
