<script lang="ts">
	import Spacer from '../../../components/Spacer.svelte';
	import Button from '../../../components/Button.svelte';
	import Card from '../../../components/wireframe/Card.svelte';
	import Separation from '../../../components/Separation.svelte';
	import { useDevices, useFields, useReturnButton } from '../../../stores';
	import { getDevicesByFieldId } from '../../../utils/dummyData';
	import Section from '../../../components/wireframe/Section.svelte';

	let returnButton = useReturnButton();
	returnButton.set({
		label: 'Fields',
		href: '/mobile-wireframe'
	});

	const fields = useFields();
	const devices = useDevices();
</script>

<div class="fields">
	<Section
		title="Fields:"
		buttons={[{ label: 'Create new field', href: '/mobile-wireframe/fields/new' }]}
	>
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
	</Section>

	<Section title="All devices:">
		<Button href="/mobile-wireframe/devices">See all devices</Button>
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
