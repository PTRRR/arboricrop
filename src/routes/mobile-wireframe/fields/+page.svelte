<script lang="ts">
	import Spacer from '../../../components/Spacer.svelte';
	import Button from '../../../components/Button.svelte';
	import Card from '../../../components/wireframe/Card.svelte';
	import Separation from '../../../components/Separation.svelte';
	import { useDevices, useFields, useReturnButton } from '../../../stores';
	import { getDevicesByFieldId } from '../../../utils/dummyData';

	let returnButton = useReturnButton();
	returnButton.set({
		label: 'Fields',
		href: '/mobile-wireframe'
	});

	const fields = useFields();
	const devices = useDevices();
</script>

<div class="fields">
	<Separation
		title="Fields:"
		buttons={[{ label: 'Create new field', href: '/mobile-wireframe/fields/new' }]}
	/>

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
	<Button href="/mobile-wireframe/devices">See all devices</Button>
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
