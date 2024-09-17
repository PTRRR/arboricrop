<script lang="ts">
	import Button from '../Button.svelte';
	import { createId } from '@paralleldrive/cuid2';
	import type { Field, MapLayer, Marker } from '../../utils/types';
	import Separation from '../Separation.svelte';
	import Spacer from '../Spacer.svelte';
	import { useLayers } from '../../stores';
	import MapV2 from '../MapV2.svelte';
	import { changinCenter, changinGeoJson } from '../../utils/dummyData';

	export let field: Field | undefined = undefined;
	export let onSave: ((field: Field) => void) | undefined = undefined;
	export let onDelete: ((id: string) => void) | undefined = undefined;
	export let onCancel: (() => void) | undefined = undefined;
	export let markers: Marker[] = [];

	const layers = useLayers();
	// $: fieldLayers =
	// 	field?.layers.map((it) => $layers.find((layer) => layer.id === it) as MapLayer) || [];

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
	<div class="field-form__map">
		<MapV2
			center={[6.231351138336578, 46.398638192299046]}
			maxBounds={[
				[6.02197061006523, 45.84425061226135],
				[10.476417711659073, 47.881756658719695]
			]}
			zoom={16}
			geoJSONs={[changinGeoJson]}
			{markers}
		/>
	</div>

	<slot />

	<Button
		on:click={() =>
			onSave?.({
				id: id.value,
				name: name.value,
				type: type.value,
				center: field?.center || changinCenter,
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

	.field-form__map {
		width: 100%;
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
