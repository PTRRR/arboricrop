<script lang="ts">
	import type { Device } from '../../utils/types';
	import Info from '../Info.svelte';

	let id: HTMLInputElement;
	let name: HTMLInputElement;

	type Values = {
		id: string;
		name: string;
	};

	export let editable: boolean = false;
	export let device: Device;
	export let onValues: ((values: Values) => void) | undefined = undefined;
	export const getValues = (): Values => {
		return {
			id: id.value,
			name: name.value
		};
	};
</script>

<div class="device-metadata">
	{#if editable}
		<label for="">Id:</label>
		<input bind:this={id} type="text" value={device.id} on:input={() => onValues?.(getValues())} />
		<label for="">Name:</label>
		<input
			bind:this={name}
			type="text"
			placeholder="Device name"
			value={device.name}
			on:input={() => onValues?.(getValues())}
		/>
	{:else}
		<Info label="Id:" value={device.id} />
		<Info label="Name:" value={device.name || '-'} />
	{/if}
</div>

<style>
	.device-metadata {
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
