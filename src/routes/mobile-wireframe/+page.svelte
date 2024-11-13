<script lang="ts">
	import Button from '../../components/Button.svelte';
	import Card from '../../components/wireframe/Card.svelte';
	import { useDevices, useFields, useReturnButton } from '../../stores';
	import { shuffle } from '../../utils/arrays';
	import { getDevicesByFieldId } from '../../utils/dummyData';
	import Section from '../../components/wireframe/Section.svelte';
	import CenteredWrapper from '../../components/wireframe/CenteredWrapper.svelte';

	let returnButton = useReturnButton();
	returnButton.set({
		label: 'Arboricrop'
	});

	const { devices } = useDevices();
	const { fields } = useFields();
	const randomFields = shuffle($fields).splice(0, 5);
</script>

{#if randomFields.length === 0}
	<CenteredWrapper>
		<Section title="You don't have any fields yet">
			<Button href="/mobile-wireframe/fields/new">Create new field</Button>
		</Section>
	</CenteredWrapper>
{:else}
	<Section
		title="Fields"
		buttons={[
			{
				label: 'Create new field',
				href: '/mobile-wireframe/fields/new'
			}
		]}
	>
		<div class="home__section">
			{#each randomFields as field}
				<Card href={`/mobile-wireframe/fields/${field.id}`}>
					<svelte:fragment slot="title">
						<h1>{field.name}</h1>
					</svelte:fragment>
					<svelte:fragment slot="subTitle">
						<p>{`${field.type} [${getDevicesByFieldId($devices, field.id).length} devices]`}</p>
					</svelte:fragment>
				</Card>
			{/each}
			{#if $fields.length === 0}
				<span>No fields</span>
				<Button href="/mobile-wireframe/fields/new">Create new field</Button>
			{:else}
				<Button href="/mobile-wireframe/fields">See all fields</Button>
			{/if}
		</div>
	</Section>
{/if}

<style>
	.home__section {
		display: flex;
		flex-direction: column;
		gap: var(--gap);
	}
</style>
