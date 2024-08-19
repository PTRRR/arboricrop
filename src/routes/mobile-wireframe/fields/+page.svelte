<script lang="ts">
	import Spacer from '../../../components/Spacer.svelte';
	import Button from '../../../components/wireframe/Button.svelte';
	import Card from '../../../components/wireframe/Card.svelte';
	import { useFields, useReturnButton } from '../../../stores';

	let returnButton = useReturnButton();
	returnButton.set({
		label: 'Fields',
		href: '/mobile-wireframe'
	});

	const fields = useFields();
</script>

<div class="fields">
	<div class="fields__pair-button">
		<Button href="/mobile-wireframe/fields/new">Create new field</Button>
		<Spacer size="1.5rem"></Spacer>
	</div>
	<div class="fields__list">
		{#each $fields as field}
			<Card href={`/mobile-wireframe/fields/${field.id}`}>
				<h5 slot="title">{field.name}</h5>
				<span slot="subTitle">{field.type}</span>
			</Card>
		{/each}
	</div>
</div>

<style>
	.fields__pair-button {
		position: sticky;
		top: 7rem;
		width: 100%;
		display: flex;
		flex-direction: column;
	}

	.fields__list {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
</style>
