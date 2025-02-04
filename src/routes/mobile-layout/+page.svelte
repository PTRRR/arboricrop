<script lang="ts">
	import Button from '../../components/mobile-layout/Button.svelte';
	import Card from '../../components/mobile-layout/Card.svelte';
	import Section from '../../components/mobile-layout/Section.svelte';
	import TextInput from '../../components/mobile-layout/TextInput.svelte';
	import { useFields } from '../../stores';

	const { fields } = useFields();
	let newFieldName = $state<string | number>('');
</script>

{#if $fields.length === 0}
	<div class="setup-page">
		<Section label="1: Create first field">
			<TextInput label="Name" onvalue={(name) => (newFieldName = name)} />
			<Button
				href={`/mobile-layout/fields/new/?name=${newFieldName}`}
				disabled={!newFieldName}
				fitWidth
			>
				Create
			</Button>
		</Section>
	</div>
{:else}
	<Section label="Fields:">
		{#each $fields as field}
			<Card href={`/mobile-layout/fields/${field.id}`}>
				<span>{field.name}</span>
			</Card>
		{/each}
	</Section>
{/if}

<style lang="scss">
	.setup-page {
		position: absolute;
		top: 50%;
		left: 50%;
		width: 100%;
		padding: 0 1rem;
		transform: translate(-50%, -50%);
		display: flex;
		flex-direction: column;
		justify-content: center;
		box-sizing: border-box;
	}
</style>
