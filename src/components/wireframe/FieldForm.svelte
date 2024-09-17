<script lang="ts">
	import Button from '../Button.svelte';
	import { createId } from '@paralleldrive/cuid2';
	import type { Field, Location } from '../../utils/types';
	import Separation from '../Separation.svelte';
	import Map from '../Map.svelte';
	import Spacer from '../Spacer.svelte';

	export let field: Field | undefined = undefined;
	export let onSave: ((field: Field) => void) | undefined = undefined;
	export let onDelete: ((id: string) => void) | undefined = undefined;
	export let onCancel: (() => void) | undefined = undefined;
	export let mapLocations: Location[] = [];

	let id: HTMLInputElement;
	let name: HTMLInputElement;
	let type: HTMLInputElement;
</script>

<div class="field-form">
	<Separation title="General settings:" />
	<label for="">Id:</label>
	<input bind:this={id} type="text" value={field?.id || `fie-${createId()}`} />
	<label for="">Name:</label>
	<input bind:this={name} type="text" placeholder="Field name" value={field?.name || ''} />
	<label for="">Type:</label>
	<input bind:this={type} type="text" placeholder="Field type" value={field?.type || ''} />

	<Spacer />
	<Separation title="Map:" />
	<Map locations={mapLocations} layers={field?.layers} />

	<slot />

	<Button
		on:click={() =>
			onSave?.({
				id: id.value,
				name: name.value,
				type: type.value,
				location: field?.location || { x: 0, y: 0 },
				layers: field?.layers || []
			})}
	>
		Save
	</Button>
	<Button on:click={() => onCancel?.()}>Cancel</Button>

	{#if field}
		<Button on:click={() => onDelete?.(id.value)}>Delete</Button>
	{/if}
</div>

<style>
	.field-form {
		display: flex;
		flex-direction: column;
		gap: var(--gap);
	}

	input {
		font-family: inherit;
		font-size: inherit;
		padding: 1rem;
		border: solid 1px var(--black);
		background-color: var(--white);
		outline: none;
		max-width: 100%;
		resize: vertical;
	}
</style>
